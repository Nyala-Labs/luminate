'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { rejectClaim } from "@/app/dashboard/claims/actions";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

export function RejectClaimModal({ claimId, userId, onClose }: { claimId: string, userId: string, onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    setLoading(true);
    await rejectClaim(claimId, userId, reason);
    setLoading(false);
    toast.success("Claim rejected successfully");
    onClose();
    router.push('/dashboard/claims/treasurer');
  };

  return (
    <Dialog open onOpenChange={onClose}>
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
          <Button onClick={onClose} variant="outline">Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
