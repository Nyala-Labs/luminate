'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveClaim } from "@/app/dashboard/claims/actions";
import { RejectClaimModal } from "./reject-claim-modal";

export function ReviewControls({ claim, userId }: { claim: any, userId: string }) {
  const [showRejectModal, setShowRejectModal] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <form action={approveClaim.bind(null, claim.id, userId, "Approved by Treasurer")}>
            <Button type="submit">Approve Claim</Button>
        </form>
        <Button variant="destructive" onClick={() => setShowRejectModal(true)}>Reject</Button>
      </div>
      {showRejectModal && (
        <RejectClaimModal 
          claimId={claim.id} 
          userId={userId} 
          onClose={() => setShowRejectModal(false)} 
        />
      )}
    </>
  );
}
