import { db } from "@/db";
import { happeningUpdates, happenings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function FeedPage() {
  const feed = await db
    .select({
      id: happeningUpdates.id,
      body: happeningUpdates.body,
      createdAt: happeningUpdates.createdAt,
      happeningTitle: happenings.title,
    })
    .from(happeningUpdates)
    .innerJoin(happenings, eq(happeningUpdates.happeningId, happenings.id))
    .orderBy(desc(happeningUpdates.createdAt))
    .limit(50);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Activity Feed</h1>
      <div className="space-y-4">
        {feed.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg bg-card">
            <p className="font-semibold text-sm text-primary">{item.happeningTitle}</p>
            <p className="text-sm mt-1">{item.body}</p>
            <p className="text-xs text-muted-foreground mt-2">{item.createdAt.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
