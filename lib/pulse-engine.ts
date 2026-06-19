import { Happening } from "@/lib/types/pulse";
import { differenceInDays } from "date-fns";

export function calculateAttentionLevel(happening: Happening): "normal" | "watch" | "attention" | "urgent" {
  const now = new Date();
  const updatedDate = new Date(happening.updatedAt);
  const createdDate = new Date(happening.createdAt);

  // Urgent Rules
  // - Status is pending_decision for more than 7 days.
  if (happening.status === 'pending_decision' && differenceInDays(now, updatedDate) > 7) return 'urgent';

  // Attention Rules
  // - No owner.
  if (!happening.ownerId) return 'attention';
  // - No update in 7 days.
  if (differenceInDays(now, updatedDate) > 7) return 'attention';

  // Watch Rules
  // - Idea is older than 14 days.
  if (happening.status === 'idea' && differenceInDays(now, createdDate) > 14) return 'watch';

  return 'normal';
}
