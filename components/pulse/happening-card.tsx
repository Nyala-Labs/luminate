import { Happening } from "@/lib/types/pulse";
import { StatusBadge } from "./status-badge";
import { AttentionBadge } from "./attention-badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface HappeningCardProps {
  happening: Happening;
}

export function HappeningCard({ happening }: HappeningCardProps) {
  return (
    <Link href={`/dashboard/pulse/${happening.id}`} className="block">
      <div className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{happening.title}</h3>
          <AttentionBadge level={happening.attentionLevel || "normal"} />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <StatusBadge status={happening.status} />
          <span className="text-xs text-muted-foreground capitalize">{happening.certainty} Certainty</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{happening.description}</p>
        <div className="mt-4 text-xs text-muted-foreground">
          Updated {formatDistanceToNow(happening.updatedAt, { addSuffix: true })}
        </div>
      </div>
    </Link>
  );
}
