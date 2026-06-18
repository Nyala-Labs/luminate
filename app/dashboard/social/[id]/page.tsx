import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { NewPostForm } from "@/components/social/client-form";
import { getPostMedia } from "../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const media = await getPostMedia(id);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Post {id.slice(0, 8)}</h1>
      <NewPostForm postId={id} initialMedia={media} />
    </div>
  );
}
