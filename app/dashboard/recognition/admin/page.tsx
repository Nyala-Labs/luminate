import { requireRole } from "@/lib/auth/server";
import { db } from "@/db";
import { awards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { RecognitionAdminList } from "@/components/recognition/admin-list";

export default async function RecognitionAdminPage() {
  await requireRole("Executive Level");

  const pendingAwards = await db.select().from(awards).where(eq(awards.status, "pending"));

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Recognition Admin</h1>
        <p className="text-sm text-zinc-400">Moderation queue for high-tier awards.</p>
      </div>

      <RecognitionAdminList initialAwards={pendingAwards} />
    </div>
  );
}
