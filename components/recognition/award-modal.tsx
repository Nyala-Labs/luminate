"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import config directly or define it locally to avoid importing server-side logic in Client Components
const TIER_CONFIG = {
  SPARK: { points: 5, label: "Spark", approvalRequired: false },
  HELPER: { points: 25, label: "Helper", approvalRequired: false },
  BUILDER: { points: 100, label: "Builder", approvalRequired: true },
  CATALYST: { points: 225, label: "Catalyst", approvalRequired: true },
  ARCHITECT: { points: 400, label: "Architect", approvalRequired: true },
  LUMINARY: { points: 600, label: "Luminary", approvalRequired: true },
};

export function RecognitionAwardModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-950 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Award Recognition</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select>
            <SelectTrigger className="bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Select Tier" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {Object.entries(TIER_CONFIG).map(([key, tier]) => (
                <SelectItem key={key} value={key}>
                  {tier.label} ({tier.points} pts)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea placeholder="Justification (min 50 chars)..." className="bg-zinc-900 border-zinc-800" />
          <Button className="w-full">Submit Award</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
