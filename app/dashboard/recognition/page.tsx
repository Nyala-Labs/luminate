import * as React from "react";
import { RecognitionAwardModal } from "@/components/recognition/award-modal";
import { Button } from "@/components/ui/button";

export default function RecognitionPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Recognition
          </h1>
          <p className="text-sm text-zinc-400">
            Award peers and build your Nyala reputation.
          </p>
        </div>
        <RecognitionAwardModal>Award Someone</RecognitionAwardModal>
      </div>

      <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-6">
          Recent Recognitions
        </h3>
        <p className="text-sm text-zinc-500">
          History of your recognition contributions...
        </p>
      </div>
    </div>
  );
}
