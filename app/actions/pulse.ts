"use server";

import { db } from "@/db";
import { happenings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";

export async function createHappening(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as "idea" | "exploring" | "pending_decision" | "confirmed" | "active" | "done" | "cancelled" | "archived";
  const certainty = formData.get("certainty") as "low" | "medium" | "high" | "confirmed";
  const visibility = formData.get("visibility") as "public_org" | "team_only" | "leadership" | "finance" | "private";
  
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  await db.insert(happenings).values({
    title,
    description,
    category,
    status,
    certainty,
    visibility,
    createdBy: user.id,
  });

  revalidatePath("/dashboard/pulse");
  redirect("/dashboard/pulse");
}
