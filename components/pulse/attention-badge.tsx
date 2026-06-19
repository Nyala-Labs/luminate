import { cn } from "@/lib/utils";

interface AttentionBadgeProps {
  level: "normal" | "watch" | "attention" | "urgent";
}

export function AttentionBadge({ level }: AttentionBadgeProps) {
  if (level === "normal") return null;

  const styles = {
    watch: "bg-blue-50 text-blue-700 border-blue-200",
    attention: "bg-yellow-50 text-yellow-700 border-yellow-200",
    urgent: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", styles[level])}>
      {level.toUpperCase()}
    </span>
  );
}
