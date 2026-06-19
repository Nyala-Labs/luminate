import { db } from "@/db";
import { notificationEvents } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const notifications = await db
    .select()
    .from(notificationEvents)
    .where(eq(notificationEvents.userId, user.id))
    .orderBy(desc(notificationEvents.createdAt));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 && <p className="text-muted-foreground">No notifications.</p>}
        {notifications.map((n) => (
          <Card key={n.id}>
            <CardContent className="p-4">
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm">{n.body}</p>
              <p className="text-xs text-muted-foreground mt-2">{n.createdAt.toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
