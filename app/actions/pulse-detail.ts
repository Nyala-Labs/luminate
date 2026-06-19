"use server";

import { db } from "@/db";
import { happeningSources, happeningUpdates, happenings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { logAudit } from "@/lib/audit";
import { createNotification } from "@/lib/pulse";

export async function addUpdate(happeningId: string, body: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  await db.insert(happeningUpdates).values({
    happeningId,
    authorId: user.id,
    body,
  });

  await logAudit(user.id, 'happening_update', happeningId, 'add_update', null, { body });
  
  const happening = await db.select().from(happenings).where(eq(happenings.id, happeningId)).then(r => r[0]);
  if (happening && happening.ownerId) {
    await createNotification(happening.ownerId, happeningId, 'update', `New update on ${happening.title}`, body);
  }

  revalidatePath(`/dashboard/pulse/${happeningId}`);
}

export async function addSource(happeningId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await db.insert(happeningSources).values({
    happeningId,
    sourceType: formData.get("sourceType") as string,
    title: formData.get("title") as string,
    url: formData.get("url") as string,
    addedBy: user.id,
  });

  await logAudit(user.id, 'happening_source', happeningId, 'add_source', null, { title: formData.get("title") });

  revalidatePath(`/dashboard/pulse/${happeningId}`);
}

export async function deleteUpdate(updateId: string, happeningId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  await db.delete(happeningUpdates).where(eq(happeningUpdates.id, updateId));

  revalidatePath(`/dashboard/pulse/${happeningId}`);
}

export async function editHappening(happeningId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  const oldHappening = await db.select().from(happenings).where(eq(happenings.id, happeningId)).then(r => r[0]);

  const newValues = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    status: formData.get("status") as "idea" | "exploring" | "pending_decision" | "confirmed" | "active" | "done" | "cancelled" | "archived",
    certainty: formData.get("certainty") as "low" | "medium" | "high" | "confirmed",
    visibility: formData.get("visibility") as "public_org" | "team_only" | "leadership" | "finance" | "private",
    updatedAt: new Date(),
  };

  await db.update(happenings).set(newValues).where(eq(happenings.id, happeningId));

  await logAudit(user.id, 'happening', happeningId, 'edit', oldHappening, newValues);

  revalidatePath(`/dashboard/pulse/${happeningId}`);
}

export async function deleteHappening(happeningId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  await db.delete(happenings).where(eq(happenings.id, happeningId));

  revalidatePath("/dashboard/pulse");
  redirect("/dashboard/pulse");
}
