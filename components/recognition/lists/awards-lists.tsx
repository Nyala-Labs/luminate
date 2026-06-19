import { getReceivedAwards, getUserAwards } from "@/lib/recognition/queries";
import { AwardCard, StatusBadge } from "@/components/recognition/award-cards";
import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export async function ReceivedAwardsList() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const receivedAwards = await getReceivedAwards(user.id);

  if (receivedAwards.length === 0) return <p className="text-sm text-zinc-500">No awards received yet.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {receivedAwards.map((award) => (
        <AwardCard 
          key={award.id}
          tierId={award.tierId}
          justification={award.justification}
          date={award.createdAt}
          from={`${award.giver.firstname} ${award.giver.lastname}`}
        />
      ))}
    </div>
  );
}

export async function SentAwardsList() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const userAwards = await getUserAwards(user.id);
  const sentAwards = userAwards.filter(a => a.giverId === user.id);

  if (sentAwards.length === 0) return <p className="text-sm text-zinc-500">No awards sent yet.</p>;

  return (
    <div className="space-y-3">
      {sentAwards.map(award => (
         <div key={award.id} className="flex justify-between items-center p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                {award.receiver.firstname?.[0]}{award.receiver.lastname?.[0]}
              </div>
              <span className="text-sm font-medium text-zinc-200">To {award.receiver.firstname} {award.receiver.lastname}</span>
            </div>
            <StatusBadge status={award.status} />
         </div>
      ))}
    </div>
  );
}
