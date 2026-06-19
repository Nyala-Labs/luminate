import { getHappeningsForDashboard, getHappeningDetails } from '@/lib/pulse';
import { generateDigest } from '@/lib/pulse/digest';
import { DigestViewer } from '@/components/pulse/digest-viewer';
import { Toaster } from "@/components/ui/sonner";
import { Happening } from '@/lib/types/pulse';

export default async function DigestPage() {
  const data = await getHappeningsForDashboard();
  const allHappenings = [...data.now, ...data.thisWeek, ...data.brewing, ...data.needsAttention];
  
  // Need to fetch updates for the digest
  const happeningsWithUpdates = await Promise.all(
    allHappenings.map(async (h) => {
      const details = await getHappeningDetails(h.id);
      return { ...h, updates: details?.updates || [] };
    })
  );

  const digest = generateDigest(happeningsWithUpdates as any, 'weekly');

  return (
    <div className="p-6 max-w-2xl mx-auto">
        <DigestViewer digest={digest} />
        <Toaster />
    </div>
  );
}
