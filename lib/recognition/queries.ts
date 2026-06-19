import { db } from "@/db";
import { awards, users } from "@/db/schema";
import { or, eq, desc } from "drizzle-orm";

export async function getUserAwards(userId: string) {
  return await db
    .select({
      id: awards.id,
      tierId: awards.tierId,
      justification: awards.justification,
      status: awards.status,
      giverId: awards.giverId,
      receiverId: awards.receiverId,
      receiver: { firstname: users.firstname, lastname: users.lastname, profilePic: users.profilePic },
      createdAt: awards.createdAt
    })
    .from(awards)
    .innerJoin(users, eq(awards.receiverId, users.id))
    .where(or(eq(awards.giverId, userId), eq(awards.receiverId, userId)))
    .orderBy(desc(awards.createdAt));
}

export async function getReceivedAwards(userId: string) {
  return await db
    .select({
      id: awards.id,
      tierId: awards.tierId,
      justification: awards.justification,
      status: awards.status,
      giver: { firstname: users.firstname, lastname: users.lastname },
      createdAt: awards.createdAt
    })
    .from(awards)
    .innerJoin(users, eq(awards.giverId, users.id))
    .where(eq(awards.receiverId, userId))
    .orderBy(awards.createdAt);
}
