import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { RecognitionAwardModal } from "@/components/recognition/award-modal";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/server";
import { ReceivedAwardsList, SentAwardsList } from "@/components/recognition/lists/awards-lists";
import { AwardsLoading } from "@/components/recognition/lists/awards-loading";

export default async function RecognitionPage() {
  const user = await getCurrentUser();
  if (!user) return null;

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
        <div className="flex items-center gap-3">
          {user.roleTitles.includes("Executive") && (
            <Link href="/dashboard/recognition/admin">
              <Button variant="outline">Admin Approvals</Button>
            </Link>
          )}
          <RecognitionAwardModal>
            <Button>Award Someone</Button>
          </RecognitionAwardModal>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Received Awards */}
        <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-6">Received Awards</h3>
          <Suspense fallback={<AwardsLoading />}>
            <ReceivedAwardsList />
          </Suspense>
        </div>

        {/* Sent & History */}
        <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-6">Recognition History</h3>
          <Suspense fallback={<AwardsLoading />}>
            <SentAwardsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
