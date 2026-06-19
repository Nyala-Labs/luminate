import { db } from "@/db";
import { awards, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TIER_CONFIG } from "@/lib/config/recognition";
import Image from "next/image";

export async function ContributionGallery() {
  const latestAwards = await db
    .select({
      id: awards.id,
      tierId: awards.tierId,
      receiverFirstname: users.firstname,
      receiverLastname: users.lastname,
      receiverProfilePic: users.profilePic,
      createdAt: awards.createdAt,
    })
    .from(awards)
    .innerJoin(users, eq(awards.receiverId, users.id))
    .where(eq(awards.status, "approved"))
    .orderBy(desc(awards.createdAt))
    .limit(10);

  if (latestAwards.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 w-full bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800 p-5 text-center">
        <p className="text-zinc-500 text-sm">No recent contributions yet.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {latestAwards.map((award) => {
        const tier = TIER_CONFIG[award.tierId as keyof typeof TIER_CONFIG];
        return (
          <div
            key={award.id}
            className="min-w-[240px] h-32 bg-zinc-900 rounded-xl p-5 border border-zinc-800 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <p className={`text-xs font-bold uppercase ${tier?.color || "text-zinc-400"}`}>
                {tier?.label || award.tierId}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 overflow-hidden shrink-0">
                {award.receiverProfilePic ? (
                  <Image src={award.receiverProfilePic} alt="Profile" width={32} height={32} />
                ) : (
                  <>
                    {award.receiverFirstname?.[0]}
                    {award.receiverLastname?.[0]}
                  </>
                )}
              </div>
              <div className="truncate">
                <p className="text-xs text-zinc-400">Awarded to</p>
                <p className="text-sm font-medium text-white truncate">
                  {award.receiverFirstname} {award.receiverLastname}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
