import * as React from "react";
import { RecognitionAwardModal } from "@/components/recognition/award-modal";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/server";
import { db } from "@/db";
import { awards, users } from "@/db/schema";
import { or, eq, desc } from "drizzle-orm";

export default async function RecognitionPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const userAwards = await db
    .select({
      id: awards.id,
      tierId: awards.tierId,
      justification: awards.justification,
      status: awards.status,
      giverId: awards.giverId,
      receiverId: awards.receiverId,
      receiver: { firstname: users.firstname, lastname: users.lastname, profilePic: users.profilePic },
      createdAt: awards.createdAt
    })
    .from(awards)
    .innerJoin(users, eq(awards.receiverId, users.id))
    .where(or(eq(awards.giverId, user.id), eq(awards.receiverId, user.id)))
    .orderBy(desc(awards.createdAt));

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

      <div className="grid gap-8">
        {/* Received Awards */}
        <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-6">Received Awards</h3>
          {receivedAwards.length === 0 ? (
            <p className="text-sm text-zinc-500">No awards received yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {receivedAwards.map((award) => (
                <div key={award.id} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <p className="text-sm font-semibold text-rose-400">{award.tierId} Award</p>
                  <p className="text-xs text-zinc-300 mt-2 line-clamp-2">{award.justification}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                    <p className="text-[10px] text-zinc-500">From: {award.giver.firstname} {award.giver.lastname}</p>
                    <span className="text-[10px] text-zinc-600">{new Date(award.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sent & History */}
        <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-6">Recognition History</h3>
          {userAwards.filter(a => a.giverId === user.id).length === 0 ? (
            <p className="text-sm text-zinc-500">No awards sent yet.</p>
          ) : (
            <div className="space-y-3">
              {userAwards.filter(a => a.giverId === user.id).map(award => (
                 <div key={award.id} className="flex justify-between items-center p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                        {award.receiver.firstname?.[0]}{award.receiver.lastname?.[0]}
                      </div>
                      <span className="text-sm font-medium text-zinc-200">To {award.receiver.firstname} {award.receiver.lastname}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                      award.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 
                      award.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>{award.status}</span>
                 </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
