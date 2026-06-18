'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveClaim, rejectClaim } from "@/app/dashboard/claims/actions";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ExecutiveControls({ claim, userId }: { claim: any, userId: string }) {
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    await approveClaim(claim.id, userId, "Approved by Executive");
    setLoading(false);
    toast.success("Claim approved successfully");
    router.push('/dashboard/claims/executive');
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    setLoading(true);
    await rejectClaim(claim.id, userId, reason);
    setLoading(false);
    toast.success("Claim rejected successfully");
    setShowRejectModal(false);
    router.push('/dashboard/claims/executive');
  };

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={handleApprove} disabled={loading}>Approve Claim</Button>
        <Button variant="destructive" onClick={() => setShowRejectModal(true)} disabled={loading}>Reject Claim</Button>
      </div>

      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Claim</DialogTitle>
          </DialogHeader>
          <Textarea 
            placeholder="Reason for rejection" 
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
          />
          <div className="flex gap-2">
            <Button onClick={handleReject} variant="destructive" disabled={loading}>Reject Claim</Button>
            <Button onClick={() => setShowRejectModal(false)} variant="outline">Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
