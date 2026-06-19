"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { reviewReceipt } from "@/app/dashboard/claims/actions";
import { toast } from "sonner";

import { claimReceipts } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

type ClaimReceipt = InferSelectModel<typeof claimReceipts> & { driveUrl: string };

export function ReviewReceiptModal({
  receipt,
  canReview,
  onClose,
}: {
  receipt: ClaimReceipt;
  canReview: boolean;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (status: "ACCEPTED" | "INVALIDATED") => {
    setLoading(true);
    await reviewReceipt(receipt.id, status, reason);
    setLoading(false);
    toast.success(`Receipt ${status.toLowerCase()} successfully`);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className=" h-[90vh] mx-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Review Receipt</DialogTitle>
        </DialogHeader>
        <iframe
          src={receipt.driveUrl.replace("/view", "/preview")}
          className="w-full flex-grow"
        />
        {canReview && receipt.status === 'PENDING' && (
          <>
            <Textarea
              placeholder="Rejection reason (if invalidating)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleAction("ACCEPTED")}
                disabled={loading}
              >
                Accept
              </Button>
              <Button
                onClick={() => handleAction("INVALIDATED")}
                variant="destructive"
                disabled={loading}
              >
                Invalidate
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
