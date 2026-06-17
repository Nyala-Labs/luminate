import * as React from "react";
import { RecognitionAwardModal } from "@/components/recognition/award-modal";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/server";
import { db } from "@/db";
import { awards, users } from "@/db/schema";
import { or, eq } from "drizzle-orm";

export default async function RecognitionPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const userAwards = await db
    .select()
    .from(awards)
    .where(or(eq(awards.giverId, user.id), eq(awards.receiverId, user.id)))
    .orderBy(awards.createdAt);

  const receivedAwards = await db
    .select({
      id: awards.id,
      tierId: awards.tierId,
      justification: awards.justification,
      status: awards.status,
      giver: { firstname: users.firstname, lastname: users.lastname },
      createdAt: awards.createdAt
    })
    .from(awards)
    .innerJoin(users, eq(awards.giverId, users.id))
    .where(eq(awards.receiverId, user.id))
    .orderBy(awards.createdAt);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ... header code ... */}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Received Awards */}
        <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-6">Received Awards</h3>
          {receivedAwards.length === 0 ? (
            <p className="text-sm text-zinc-500">No awards received yet.</p>
          ) : (
            <div className="space-y-4">
              {receivedAwards.map((award) => (
                <div key={award.id} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <p className="text-sm font-semibold text-rose-300">{award.tierId} Award</p>
                  <p className="text-xs text-zinc-400 mt-1">{award.justification}</p>
                  <p className="text-[10px] text-zinc-500 mt-2">From: {award.giver.firstname} {award.giver.lastname}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sent/History */}
        <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-6">Sent & Pending</h3>
          {userAwards.filter(a => a.giverId === user.id).map(award => (
             <div key={award.id} className="flex justify-between items-center p-3 text-sm border-b border-zinc-800/50">
                <span>To {award.receiverId.slice(0,6)}...</span>
                <span className="text-xs text-zinc-500 capitalize">{award.status}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );

}
