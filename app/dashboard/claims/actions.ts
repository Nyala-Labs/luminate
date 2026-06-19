'use server';

import 'server-only';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { claims, claimItems, claimReceipts, claimApprovals, claimPayments } from '@/db/schema';
import { createClaimFolder, uploadMedia, getFileMetadata } from '@/lib/google-drive';
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

  const status = 'TREASURER_REVIEW';
  await db.update(claims).set({ status }).where(eq(claims.id, claimId));
  await logAudit(user.id, 'claim', claimId, 'SUBMITTED', { status: 'DRAFT' }, { status });
  revalidatePath('/dashboard/claims');
}

export async function updateClaim(claimId: string, data: z.infer<typeof createClaimSchema>) {
  const result = createClaimSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.format() };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const [existingClaim] = await db.select().from(claims).where(eq(claims.id, claimId));
  if (!existingClaim || existingClaim.status !== 'DRAFT') {
    return { success: false, error: "Claim cannot be edited" };
  }

  const { title, description, items } = result.data;
  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  try {
    await db.transaction(async (tx) => {
      await tx.update(claims).set({
        title,
        description,
        totalAmount: totalAmount.toString(),
      }).where(eq(claims.id, claimId));

      await tx.delete(claimItems).where(eq(claimItems.claimId, claimId));

      if (items.length > 0) {
        await tx.insert(claimItems).values(
          items.map(item => ({
            claimId: claimId,
            description: item.description,
            amount: parseFloat(item.amount).toString(),
            category: item.category,
          }))
        );
      }
      
      await logAudit(user.id, 'claim', claimId, 'UPDATED', existingClaim, { title, description, totalAmount: totalAmount.toString() });
    });

    revalidatePath(`/dashboard/claims/${claimId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating claim:", error);
    return { success: false, error: "Failed to update claim" };
  }
}

export async function approveClaim(claimId: string, actorId: string, comment: string) {
  const [claim] = await db.select().from(claims).where(eq(claims.id, claimId));
  const isTreasurer = await checkRole(actorId, 'treasurer');
  const isExecutive = await checkRole(actorId, 'executive');

  if (isTreasurer && (claim.status === 'TREASURER_REVIEW' || claim.status === 'SUBMITTED')) {
    const totalAmount = parseFloat(claim.totalAmount);
    // Move to WAITING_FOR_PAYMENT if <= 100, otherwise EXECUTIVE_REVIEW
    const newStatus = totalAmount <= 100 ? 'WAITING_FOR_PAYMENT' : 'EXECUTIVE_REVIEW';
    await db.update(claims).set({ status: newStatus }).where(eq(claims.id, claimId));
    await db.insert(claimApprovals).values({ claimId, stage: 'treasurer', action: 'approved', actorId, comment });
    await logAudit(actorId, 'claim', claimId, 'TREASURER_APPROVED', { status: claim.status }, { status: newStatus });
  } else if (isExecutive && claim.status === 'EXECUTIVE_REVIEW') {
    await db.update(claims).set({ status: 'WAITING_FOR_PAYMENT' }).where(eq(claims.id, claimId));
    await db.insert(claimApprovals).values({ claimId, stage: 'executive', action: 'approved', actorId, comment });
    await logAudit(actorId, 'claim', claimId, 'EXECUTIVE_APPROVED', { status: 'EXECUTIVE_REVIEW' }, { status: 'WAITING_FOR_PAYMENT' });
  } else {
    throw new Error("Unauthorized action or invalid status");
  }
  revalidatePath('/dashboard/claims');
}

export async function rejectClaim(claimId: string, actorId: string, comment: string) {
  const [claim] = await db.select().from(claims).where(eq(claims.id, claimId));
  const isTreasurer = await checkRole(actorId, 'treasurer');
  const isExecutive = await checkRole(actorId, 'executive');

  if ((isTreasurer || isExecutive) && (claim.status === 'TREASURER_REVIEW' || claim.status === 'SUBMITTED' || claim.status === 'EXECUTIVE_REVIEW')) {
    await db.update(claims).set({ status: 'REJECTED' }).where(eq(claims.id, claimId));
    await db.insert(claimApprovals).values({ 
      claimId, 
      stage: isTreasurer ? 'treasurer' : 'executive', 
      action: 'rejected', 
      actorId, 
      comment 
    });
    await logAudit(actorId, 'claim', claimId, 'REJECTED', { status: claim.status }, { status: 'REJECTED' });
  } else {
    throw new Error("Unauthorized action or invalid status");
  }
  revalidatePath('/dashboard/claims');
}

export async function reviewReceipt(receiptId: string, status: 'ACCEPTED' | 'INVALIDATED', reason?: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  // Verify user is treasurer
  const isTreasurer = await checkRole(user.id, 'treasurer');
  if (!isTreasurer) throw new Error("Unauthorized");

  await db.update(claimReceipts)
    .set({ status, rejectionReason: reason })
    .where(eq(claimReceipts.id, receiptId));
  
  revalidatePath('/dashboard/claims');
}

export async function submitPayment(claimId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  const isTreasurer = await checkRole(user.id, 'treasurer');
  if (!isTreasurer) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.provider_token;
  if (!accessToken) throw new Error("No access token");

  const file = formData.get("file") as File;
  const folderId = await createClaimFolder(accessToken, claimId);
  const buffer = Buffer.from(await file.arrayBuffer());
  const driveFileId = await uploadMedia(accessToken, folderId!, buffer, file.name, file.type);
  
  await db.transaction(async (tx) => {
    await tx.insert(claimPayments).values({
      claimId,
      paidBy: user.id,
      amount: "0", // Simplified for now
      proofDriveFileId: driveFileId!,
      proofDriveUrl: `https://drive.google.com/file/d/${driveFileId}/view`,
    });
    
    await tx.update(claims).set({ status: 'PAID' }).where(eq(claims.id, claimId));
  });

  revalidatePath(`/dashboard/claims/${claimId}`);
}

export async function uploadClaimReceipts(claimId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.provider_token;
  
  if (!accessToken) {
    throw new Error("Google Drive access not found. Please log out and log in again, ensuring you grant access to Google Drive.");
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

export async function getClaimReceipts(claimId: string) {
  const receipts = await db.select().from(claimReceipts).where(eq(claimReceipts.claimId, claimId));
  
  // Try to get access token, but handle case where it might not be available (e.g. for non-treasurer viewers)
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.provider_token;
  
  return Promise.all(receipts.map(async (r) => {
    let metadata: { name?: string | undefined, mimeType?: string | undefined, thumbnailLink?: string | undefined, webViewLink?: string | undefined } = { name: "Receipt" };
    if (accessToken) {
      const fetched = await getFileMetadata(accessToken, r.driveFileId);
      metadata = {
        name: fetched.name ?? undefined,
        mimeType: fetched.mimeType ?? undefined,
        thumbnailLink: fetched.thumbnailLink ?? undefined,
        webViewLink: fetched.webViewLink ?? undefined
      };
    }
    
    return { 
      ...r,
      name: metadata.name || "Receipt",
      mimeType: metadata.mimeType || "application/octet-stream",
      thumbnailLink: metadata.thumbnailLink || undefined,
      webViewLink: metadata.webViewLink || undefined
    };
  }));
}

export async function deleteClaim(claimId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const [claim] = await db.select().from(claims).where(eq(claims.id, claimId));
  
  if (!claim) throw new Error("Claim not found");
  if (claim.status !== 'DRAFT') throw new Error("Only DRAFT claims can be deleted");
  if (claim.submittedBy !== user.id) throw new Error("Unauthorized");

  await db.delete(claims).where(eq(claims.id, claimId));
  await logAudit(user.id, 'claim', claimId, 'DELETED', claim, null);
  
  revalidatePath('/dashboard/claims');
}
