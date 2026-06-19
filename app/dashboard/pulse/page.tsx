import { getHappeningsForDashboard } from "@/lib/pulse";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PulseDashboardClient } from "@/components/pulse/pulse-wrapper";

export default async function PulseDashboard() {
  const data = await getHappeningsForDashboard();

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pulse Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Link href="/dashboard/pulse/digest">Generate Digest</Link>
          </Button>
          <Button>
            <Link
              href="/dashboard/pulse/new"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Happening</span>
            </Link>
          </Button>
        </div>
      </div>

      <PulseDashboardClient initialData={data} />
    </div>
  );
}
