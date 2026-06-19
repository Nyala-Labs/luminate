import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClaimsList } from "@/components/claims/claims-list";

export default async function ClaimsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Claims</h1>
        <Button>
          <Link href="/dashboard/claims/new">Create Claim</Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading claims...</div>}>
        <ClaimsList />
      </Suspense>
    </div>
  );
}
