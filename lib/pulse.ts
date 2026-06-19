import 'server-only';
import { happenings, happeningUpdates, happeningSources, notificationEvents, auditLogs } from '@/db/schema';
import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { Happening } from '@/lib/types/pulse';
import { calculateAttentionLevel } from '@/lib/pulse-engine';

export async function getHappeningsForDashboard() {
  const allHappenings = await db.select().from(happenings).orderBy(desc(happenings.updatedAt));
  
  const processed = allHappenings.map(h => ({
    ...h,
    attentionLevel: calculateAttentionLevel(h as unknown as Happening)
  }));

  const needsAttention = processed.filter(h => h.attentionLevel === 'attention' || h.attentionLevel === 'urgent');
  const remaining = processed.filter(h => !needsAttention.find(n => n.id === h.id));

  return {
    now: remaining.filter(h => h.status === 'active'),
    thisWeek: remaining.filter(h => h.status === 'confirmed'),
    brewing: remaining.filter(h => h.status === 'idea' || h.status === 'exploring' || h.status === 'pending_decision'),
    needsAttention,
  };
}

export async function getHappeningDetails(id: string) {
  try {
    const results = await db.select().from(happenings).where(eq(happenings.id, id));
    const happening = results[0];
    if (!happening) return null;
    
    const updates = await db.select().from(happeningUpdates).where(eq(happeningUpdates.happeningId, id)).orderBy(desc(happeningUpdates.createdAt));
    const sources = await db.select().from(happeningSources).where(eq(happeningSources.happeningId, id));
    const history = await db.select().from(auditLogs).where(eq(auditLogs.entityId, id)).orderBy(desc(auditLogs.timestamp));

    return { ...happening, updates, sources, history };
  } catch (error) {
    console.error("Error fetching happening details:", error);
    return null;
  }
}

export async function createNotification(userId: string, happeningId: string, type: string, title: string, body: string) {
  await db.insert(notificationEvents).values({
    userId,
    happeningId,
    type,
    title,
    body,
  });
}
