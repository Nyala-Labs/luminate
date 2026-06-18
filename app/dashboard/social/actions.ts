"use server";
import 'server-only';

import { createPostFolder, uploadMedia, getFileMetadata } from "@/lib/google-drive";
import { db } from "@/db";
import { socialPosts, postMedia } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

export async function createPost(ownerId: string) {
  const [newPost] = await db
    .insert(socialPosts)
    .values({ ownerId })
    .returning();
  
  revalidateTag('social-posts');
  redirect(`/dashboard/social/${newPost.id}`);
}

export async function uploadPostMedia(postId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const accessToken = session?.provider_token; 
  
  if (!accessToken) {
    throw new Error("User not authenticated with Google Drive permissions");
  }

  const files = formData.getAll("files") as File[];
  if (files.length === 0) throw new Error("No files provided");

  const folderId = await createPostFolder(accessToken, postId);

  const uploadPromises = files.map(async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const driveFileId = await uploadMedia(accessToken, folderId!, buffer, file.name, file.type);
    
    if (!driveFileId) throw new Error("Failed to upload media");

    // 3. Insert into post_media table
    await db.insert(postMedia).values({
      postId,
      driveFileId: driveFileId,
    });
    
    return driveFileId;
  });

  await Promise.all(uploadPromises);
}

export async function getPostMedia(postId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.provider_token; 
  if (!accessToken) throw new Error("No access token");

  const media = await db.select().from(postMedia).where(eq(postMedia.postId, postId));
  
  return Promise.all(media.map(async (m) => {
    const metadata = await getFileMetadata(accessToken, m.driveFileId);
    return { 
      id: m.id,
      driveFileId: m.driveFileId,
      name: metadata.name || undefined,
      mimeType: metadata.mimeType || undefined,
      thumbnailLink: metadata.thumbnailLink || undefined,
      webViewLink: metadata.webViewLink || undefined
    };
  }));
}

export async function deletePostMedia(mediaId: string) {
  return await db.delete(postMedia).where(eq(postMedia.id, mediaId));
}
