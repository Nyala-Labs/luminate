import { getCachedSocialPosts } from "@/lib/social/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPost } from "./actions";
import { getCurrentUser } from "@/lib/auth/server";
import { Share2 } from "lucide-react";

export default async function SocialDashboardPage() {
  const user = await getCurrentUser();
  const posts = await getCachedSocialPosts();

  async function handleCreatePost() {
    "use server";
    if (user) {
      await createPost(user.id);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Social Blaster</h1>
        <form action={handleCreatePost}>
          <Button type="submit">New Post</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link href={`/dashboard/social/${post.id}`} key={post.id}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Post {post.id.slice(0, 8)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400">Status: {post.status}</p>
                  <p className="text-zinc-500 text-sm">Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <Share2 className="w-12 h-12 text-zinc-700 mb-4" />
            <h3 className="text-lg font-semibold text-white">No social posts yet</h3>
            <p className="text-zinc-500 max-w-sm mt-2">
              Get started by creating your first multi-platform social media blast.
            </p>
            <form action={handleCreatePost} className="mt-6">
              <Button type="submit" variant="outline">Create Your First Post</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
