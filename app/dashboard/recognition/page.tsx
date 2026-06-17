import * as React from "react";
import { RecognitionAwardModal } from "@/components/recognition/award-modal";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/server";
import { db } from "@/db";
import { awards } from "@/db/schema";
import { or, eq } from "drizzle-orm";

export default async function RecognitionPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const userAwards = await db
    .select()
    .from(awards)
    .where(or(eq(awards.giverId, user.id), eq(awards.receiverId, user.id)))
    .orderBy(awards.createdAt);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Recognition
          </h1>
          <p className="text-sm text-zinc-400">
            Award peers and build your Nyala reputation.
          </p>
        </div>
        <RecognitionAwardModal>
          <Button>Award Someone</Button>
        </RecognitionAwardModal>
      </div>

      <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-6">
          Recent Recognitions
        </h3>
        {userAwards.length === 0 ? (
          <p className="text-sm text-zinc-500">No recognition history yet.</p>
        ) : (
          <div className="space-y-4">
            {userAwards.map((award) => (
              <div
                key={award.id}
                className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    {award.tierId} Award
                  </p>
                  <p className="text-xs text-zinc-400">
                    {award.justification.slice(0, 60)}...
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                    award.status === "pending"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  {award.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
