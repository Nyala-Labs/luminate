import 'server-only';
import { db } from "@/db";
import { awards } from "@/db/schema";

export const TIER_CONFIG = {
  SPARK: { points: 5, approvalRequired: false },
  HELPER: { points: 25, approvalRequired: false },
  BUILDER: { points: 100, approvalRequired: true },
  CATALYST: { points: 225, approvalRequired: true },
  ARCHITECT: { points: 400, approvalRequired: true },
  LUMINARY: { points: 600, approvalRequired: true },
};

export async function createAward(data: {
  giverId: string;
  receiverId: string;
  tierId: keyof typeof TIER_CONFIG;
  justification: string;
  evidenceUrl?: string;
}) {
  const tier = TIER_CONFIG[data.tierId];
  if (!tier) throw new Error("Invalid tier");

  const [newAward] = await db.insert(awards).values({
    giverId: data.giverId,
    receiverId: data.receiverId,
    tierId: data.tierId,
    justification: data.justification,
    evidenceUrl: data.evidenceUrl,
    status: tier.approvalRequired ? "pending" : "approved",
  }).returning();

  if (!tier.approvalRequired) {
    await finalizeAward(newAward.id, tier.points);
  }

  return newAward;
}

export async function finalizeAward(awardId: string, points: number) {
  // Logic to update ledger and reputation table
}
