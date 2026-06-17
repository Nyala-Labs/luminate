import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { users, userRoles, roles } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export type CurrentUser = {
  id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  profilePic: string | null;
  status: 'PENDING' | 'ACTIVE' | 'REVOKED';
  lastSignedIn: Date | null;
  roleTitles: string[];
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser?.email) return null;

  const result = await db
    .select({
      id: users.id,
      email: users.email,
      firstname: users.firstname,
      lastname: users.lastname,
      profilePic: users.profilePic,
      status: users.status,
      lastSignedIn: users.lastSignedIn,
      roleTitle: roles.title,
    })
    .from(users)
    .leftJoin(userRoles, eq(users.id, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .where(and(eq(users.email, authUser.email), isNull(users.deletedAt)))
    .limit(1);

  if (result.length === 0) return null;

  const row = result[0];
  return {
    id: row.id,
    email: row.email,
    firstname: row.firstname,
    lastname: row.lastname,
    profilePic: row.profilePic,
    status: row.status,
    lastSignedIn: row.lastSignedIn ? new Date(row.lastSignedIn) : null,
    roleTitles: result.map((r: any) => r.roleTitle).filter(Boolean) as string[],
  };
});


export async function requireAuth(): Promise<CurrentUser> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/auth/login');
  }
  return currentUser;
}

export async function hasRole(roleTitle: string): Promise<boolean> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return false;
  return currentUser.roleTitles.includes(roleTitle);
}

export async function requireRole(roleTitle: string): Promise<CurrentUser> {
  const currentUser = await requireAuth();
  if (!currentUser.roleTitles.includes(roleTitle)) {
    redirect('/403');
  }
  return currentUser;
}
