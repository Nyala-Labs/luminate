import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export async function logAudit(
  actorId: string,
  entityType: string,
  entityId: string,
  action: string,
  oldValue: Record<string, unknown> | null,
  newValue: Record<string, unknown> | null
) {
  await db.insert(auditLogs).values({
    entityType,
    entityId,
    action,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    oldValue: oldValue as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newValue: newValue as any,
    actorId,
    timestamp: new Date(),
  });
}
