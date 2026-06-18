import { db } from "@/db";
import { users, userRoles, roles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserRole(userId: string) {
  const result = await db
    .select({ title: roles.title })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  return result.map(r => r.title);
}

export async function checkRole(userId: string, requiredRole: string) {
  const userRoles = await getUserRole(userId);
  return userRoles.some(role => role.toLowerCase() === requiredRole.toLowerCase());
}
