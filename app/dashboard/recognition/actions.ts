"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { and, ne, ilike, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/server";
import { createAward } from "@/lib/recognition/service";
import { revalidatePath } from "next/cache";

export async function searchUsers(query: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  return await db
    .select({ id: users.id, email: users.email, firstname: users.firstname, lastname: users.lastname })
    .from(users)
    .where(
      and(
        ne(users.id, currentUser.id),
        or(
          ilike(users.email, `%${query}%`),
          ilike(users.firstname, `%${query}%`),
          ilike(users.lastname, `%${query}%`)
        )
      )
    )
    .limit(10);
}

export async function submitAward(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  const receiverId = formData.get("receiverId") as string;
  const tierId = formData.get("tierId") as string;
  const justification = formData.get("justification") as string;

  if (!receiverId || !tierId || justification.length < 50) {
    throw new Error("Invalid input: Justification must be at least 50 chars");
  }

  await createAward({
    giverId: currentUser.id,
    receiverId,
    tierId,
    justification,
  });

  revalidatePath("/dashboard/recognition");
  return { success: true };
}
