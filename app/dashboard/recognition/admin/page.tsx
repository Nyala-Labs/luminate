import * as React from "react";
import { requireRole } from "@/lib/auth/server";
import { db } from "@/db";
import { awards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";

export default async function RecognitionAdminPage() {
  await requireRole("Executive Level");

  const pendingAwards = await db.select().from(awards).where(eq(awards.status, "pending"));

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Recognition Admin</h1>
        <p className="text-sm text-zinc-400">Moderation queue for high-tier awards.</p>
      </div>

      <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-6">Pending Approvals</h3>
        {pendingAwards.length === 0 ? (
          <p className="text-sm text-zinc-500">No pending awards.</p>
        ) : (
          <div className="space-y-4">
            {pendingAwards.map((award: any) => (
              <div key={award.id} className="p-4 border border-zinc-800/50 rounded-xl flex justify-between items-center">
                <span className="text-sm text-zinc-300">Award #{award.id.slice(0,8)} - {award.tierId}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Approve</Button>
                  <Button variant="destructive" size="sm">Reject</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
