export const TIER_CONFIG = {
  SPARK: { points: 5, label: "Spark", approvalRequired: false, color: "text-amber-400" },
  HELPER: { points: 25, label: "Helper", approvalRequired: false, color: "text-blue-400" },
  BUILDER: { points: 100, label: "Builder", approvalRequired: true, color: "text-emerald-400" },
  CATALYST: { points: 225, label: "Catalyst", approvalRequired: true, color: "text-purple-400" },
  ARCHITECT: { points: 400, label: "Architect", approvalRequired: true, color: "text-rose-400" },
  LUMINARY: { points: 600, label: "Luminary", approvalRequired: true, color: "text-indigo-400" },
};

export const AWARD_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};
