export interface Happening {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: "idea" | "exploring" | "pending_decision" | "confirmed" | "active" | "done" | "cancelled" | "archived";
  certainty: "low" | "medium" | "high" | "confirmed";
  visibility: "public_org" | "team_only" | "leadership" | "finance" | "private";
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields (often needed)
  attentionLevel?: "normal" | "watch" | "attention" | "urgent";
}
