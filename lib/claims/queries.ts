import { db } from "@/db";
import { claims } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserClaims(userId: string) {
  return await db
    .select()
    .from(claims)
    .where(eq(claims.submittedBy, userId));
}
