'use server';

import 'server-only';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { claims, claimItems, claimReceipts, claimApprovals } from '@/db/schema';
import { createClaimFolder, uploadMedia } from '@/lib/google-drive';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { logAudit } from '@/lib/audit';
import { checkRole } from '@/lib/auth/rbac';
import { getCurrentUser } from '@/lib/auth/server';

const createClaimSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, "Item description is required"),
    amount: z.string().min(1, "Amount is required"),
    category: z.string().min(1, "Category is required"),
  })).min(1, "At least one item is required"),
});

export async function createClaim(data: z.infer<typeof createClaimSchema>) {
  const result = createClaimSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.format() };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { title, description, items } = result.data;
  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  try {
    let claimId: string;
    await db.transaction(async (tx) => {
      const [newClaim] = await tx.insert(claims).values({
        title,
        description,
        submittedBy: user.id,
        totalAmount: totalAmount.toString(),
      }).returning();
      
      claimId = newClaim.id;

      await logAudit(user.id, 'claim', newClaim.id, 'CREATED', null, newClaim);

      if (items.length > 0) {
        await tx.insert(claimItems).values(
          items.map(item => ({
            claimId: newClaim.id,
            description: item.description,
            amount: parseFloat(item.amount).toString(),
            category: item.category,
          }))
        );
      }
    });

    revalidatePath('/dashboard/claims');
    return { success: true, claimId: claimId! };
  } catch (error) {
    console.error("Error creating claim:", error);
    return { success: false, error: "Failed to create claim" };
  }
}

export async function submitClaim(claimId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const [claim] = await db.select().from(claims).where(eq(claims.id, claimId));
  if (!claim || claim.status !== 'DRAFT') throw new Error("Invalid claim status");

  const status = 'SUBMITTED';
  await db.update(claims).set({ status }).where(eq(claims.id, claimId));
  await logAudit(user.id, 'claim', claimId, 'SUBMITTED', { status: 'DRAFT' }, { status });
  revalidatePath('/dashboard/claims');
}

export async function approveClaim(claimId: string, actorId: string, comment: string) {
  const [claim] = await db.select().from(claims).where(eq(claims.id, claimId));
  const isTreasurer = await checkRole(actorId, 'treasurer');
  const isExecutive = await checkRole(actorId, 'executive');

  if (isTreasurer && claim.status === 'SUBMITTED') {
    const totalAmount = parseFloat(claim.totalAmount);
    const newStatus = totalAmount > 100 ? 'EXECUTIVE_REVIEW' : 'APPROVED';
    await db.update(claims).set({ status: newStatus }).where(eq(claims.id, claimId));
    await db.insert(claimApprovals).values({ claimId, stage: 'treasurer', action: 'approved', actorId, comment });
    await logAudit(actorId, 'claim', claimId, 'TREASURER_APPROVED', { status: 'SUBMITTED' }, { status: newStatus });
  } else if (isExecutive && claim.status === 'EXECUTIVE_REVIEW') {
    await db.update(claims).set({ status: 'APPROVED' }).where(eq(claims.id, claimId));
    await db.insert(claimApprovals).values({ claimId, stage: 'executive', action: 'approved', actorId, comment });
    await logAudit(actorId, 'claim', claimId, 'EXECUTIVE_APPROVED', { status: 'EXECUTIVE_REVIEW' }, { status: 'APPROVED' });
  } else {
    throw new Error("Unauthorized action or invalid status");
  }
  revalidatePath('/dashboard/claims');
}

export async function uploadClaimReceipts(claimId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.provider_token;
  
  if (!accessToken) {
    throw new Error("No access token found in session.");
  }

  const files = formData.getAll("files") as File[];
  const folderId = await createClaimFolder(accessToken, claimId);

  const uploads = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const driveFileId = await uploadMedia(accessToken, folderId!, buffer, file.name, file.type);
      
      return {
        claimId,
        driveFileId: driveFileId!,
        driveUrl: `https://drive.google.com/file/d/${driveFileId}/view`,
        uploadedBy: user.id,
      };
    })
  );

  await db.insert(claimReceipts).values(uploads);
  revalidatePath(`/dashboard/claims/${claimId}`);
}
