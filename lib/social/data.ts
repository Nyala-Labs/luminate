import { unstable_cache } from 'next/cache';
import { db } from "@/db";
import { socialPosts } from "@/db/schema";
import { desc } from "drizzle-orm";

export const getCachedSocialPosts = unstable_cache(
  async () => {
    return await db.select().from(socialPosts).orderBy(desc(socialPosts.createdAt));
  },
  ['social-posts'],
  {
    tags: ['social-posts'],
    revalidate: 3600, // 1 hour
  }
);
