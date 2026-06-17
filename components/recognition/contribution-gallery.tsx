import { db } from "@/db";
import { awards, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function ContributionGallery() {
  const latestAwards = await db
    .select({
      id: awards.id,
      tierId: awards.tierId,
      giverName: users.firstname,
      createdAt: awards.createdAt
    })
    .from(awards)
    .innerJoin(users, eq(awards.giverId, users.id))
    .where(eq(awards.status, 'approved'))
    .orderBy(desc(awards.createdAt))
    .limit(10);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
       {latestAwards.map(award => (
         <div key={award.id} className="min-w-[200px] h-32 bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex flex-col justify-between">
           <p className="text-xs font-bold text-rose-400">{award.tierId}</p>
           <p className="text-sm text-zinc-200">Awarded to {award.giverName}</p>
         </div>
       ))}
    </div>
  );
}
