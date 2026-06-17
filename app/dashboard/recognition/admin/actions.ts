"use server";

import { db } from "@/db";
import { awards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/server";

export async function processAward(awardId: string, status: 'approved' | 'rejected') {
  await requireRole("Executive");

  await db
    .update(awards)
    .set({ status })
    .where(eq(awards.id, awardId));

  revalidatePath("/dashboard/recognition/admin");
  revalidatePath("/dashboard/recognition");
  return { success: true };
}
