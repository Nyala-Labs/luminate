"use client";

interface DashboardSectionProps {
  title: string;
  items: Happening[];
}

import { HappeningCard } from "@/components/pulse/happening-card";
import { Happening } from "@/lib/types/pulse";

interface DashboardSectionProps {
  title: string;
  items: Happening[];
}

export function DashboardSection({ title, items }: DashboardSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          No happenings found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((h) => (
            <HappeningCard key={h.id} happening={h} />
          ))}
        </div>
      )}
    </section>
  );
}
