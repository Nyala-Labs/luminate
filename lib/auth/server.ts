import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { users, userRoles, roles } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { CurrentUser } from './types';

// Internal function to bypass cache
async function fetchUserFromDb(): Promise<CurrentUser | null> {
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
    .where(and(eq(users.email, authUser.email), isNull(users.deletedAt)));

  if (result.length === 0) return null;

  return {
    id: result[0].id,
    email: result[0].email,
    firstname: result[0].firstname,
    lastname: result[0].lastname,
    profilePic: result[0].profilePic,
    status: result[0].status,
    lastSignedIn: result[0].lastSignedIn ? new Date(result[0].lastSignedIn) : null,
    roleTitles: result.map((r: { roleTitle: string | null }) => r.roleTitle).filter(Boolean) as string[],
  };
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  return fetchUserFromDb();
});

export async function requireAuth(): Promise<CurrentUser> {
  const currentUser = await fetchUserFromDb();
  if (!currentUser) {
    redirect('/auth/login');
  }
  return currentUser;
}

export async function hasRole(roleTitle: string): Promise<boolean> {
  const currentUser = await fetchUserFromDb();
  if (!currentUser) return false;
  return currentUser.roleTitles.some(r => r.toLowerCase() === roleTitle.toLowerCase());
}

export async function requireRole(roleTitle: string): Promise<CurrentUser> {
  const currentUser = await requireAuth();
  if (!currentUser.roleTitles.some(r => r.toLowerCase() === roleTitle.toLowerCase())) {
    redirect('/403');
  }
  return currentUser;
}
