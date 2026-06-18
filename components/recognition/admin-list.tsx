"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { processAward } from "@/app/dashboard/recognition/admin/actions";

interface Award {
  id: string;
  tierId: string;
  justification: string;
}

export function RecognitionAdminList({ initialAwards }: { initialAwards: Award[] }) {
  const [awards, setAwards] = React.useState<Award[]>(initialAwards);

  const handleProcess = async (id: string, status: 'approved' | 'rejected') => {
    await processAward(id, status);
    setAwards((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
      <h3 className="text-base font-bold text-white mb-6">Pending Approvals</h3>
      {awards.length === 0 ? (
        <p className="text-sm text-zinc-500">No pending awards.</p>
      ) : (
        <div className="space-y-4">
          {awards.map((award: Award) => (
            <div key={award.id} className="p-4 border border-zinc-800/50 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-sm text-zinc-300 font-semibold">Award #{award.id.slice(0,8)} - {award.tierId}</p>
                <p className="text-xs text-zinc-500">{award.justification}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleProcess(award.id, 'approved')}>Approve</Button>
                <Button variant="destructive" size="sm" onClick={() => handleProcess(award.id, 'rejected')}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
