import { Happening } from "@/lib/types/pulse";
import { format } from "date-fns";

interface HappeningUpdate {
  createdAt: Date;
  body: string;
}

export function generateDigest(happenings: (Happening & { updates?: HappeningUpdate[] })[], type: 'daily' | 'weekly' | 'leadership') {
  const urgent = happenings.filter(h => h.attentionLevel === 'urgent');
  const attention = happenings.filter(h => h.attentionLevel === 'attention');
  const active = happenings.filter(h => h.status === 'active');

  let digest = `Nyala Pulse — ${type.charAt(0).toUpperCase() + type.slice(1)} Summary\n\n`;

  const addSection = (title: string, items: typeof happenings) => {
    if (items.length === 0) return "";
    let section = `${title}:\n`;
    items.forEach((h, index) => {
      section += `${index + 1}. ${h.title}\n`;
      if (h.updates && h.updates.length > 0) {
        const latest = h.updates[0];
        section += `   - Last update: ${format(new Date(latest.createdAt), 'MMM d')} - ${latest.body}\n`;
      }
    });
    return section + "\n";
  };

  digest += addSection("Needs Immediate Attention", urgent);
  digest += addSection("Needs Action", attention);
  digest += addSection("Active Happenings", active);

  return digest;
}
