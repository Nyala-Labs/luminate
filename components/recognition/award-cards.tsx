import { AWARD_STATUSES } from "@/lib/config/recognition";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const styles = {
    [AWARD_STATUSES.PENDING]: "bg-amber-500/10 text-amber-500",
    [AWARD_STATUSES.REJECTED]: "bg-rose-500/10 text-rose-500",
    [AWARD_STATUSES.APPROVED]: "bg-emerald-500/10 text-emerald-500",
  };

  return (
    <span
      className={cn(
        "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
        styles[status as keyof typeof styles] || "bg-zinc-500/10 text-zinc-500"
      )}
    >
      {status}
    </span>
  );
}

export function AwardCard({
  tierId,
  justification,
  date,
  from,
}: {
  tierId: string;
  justification: string;
  date: Date;
  from?: string;
}) {
  return (
    <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
      <p className="text-sm font-semibold text-rose-400">{tierId} Award</p>
      <p className="text-xs text-zinc-300 mt-2 line-clamp-2">{justification}</p>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
        {from && <p className="text-[10px] text-zinc-500">From: {from}</p>}
        <span className="text-[10px] text-zinc-600">{new Date(date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
