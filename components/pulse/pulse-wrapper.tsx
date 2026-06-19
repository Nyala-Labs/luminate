"use client";

import { useState } from 'react';
import { PulseFilters } from '@/components/pulse/pulse-filters';
import { DashboardSection } from '@/components/pulse/dashboard-section';
import { Happening } from '@/lib/types/pulse';

interface PulseData {
  now: Happening[];
  thisWeek: Happening[];
  brewing: Happening[];
  needsAttention: Happening[];
}

export function PulseDashboardClient({ initialData }: { initialData: PulseData }) {
  const [filtered, setFiltered] = useState<Happening[] | null>(null);

  const allHappenings = [
    ...initialData.now, 
    ...initialData.thisWeek, 
    ...initialData.brewing, 
    ...initialData.needsAttention
  ];

  return (
    <>
      <PulseFilters happenings={allHappenings} onFiltered={setFiltered} />

      <DashboardSection 
        title="Now" 
        items={filtered ? filtered.filter(h => h.status === 'active') : initialData.now} 
      />
      <DashboardSection 
        title="This Week" 
        items={filtered ? filtered.filter(h => h.status === 'confirmed') : initialData.thisWeek} 
      />
      <DashboardSection 
        title="Brewing" 
        items={filtered ? filtered.filter(h => h.status === 'idea' || h.status === 'exploring' || h.status === 'pending_decision') : initialData.brewing} 
      />
      <DashboardSection 
        title="Needs Attention" 
        items={filtered ? filtered.filter(h => h.attentionLevel === 'attention' || h.attentionLevel === 'urgent') : initialData.needsAttention} 
      />
    </>
  );
}
