"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ReviewReceiptModal } from "./review-receipt-modal";

import { claimReceipts } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

type ClaimReceipt = InferSelectModel<typeof claimReceipts> & { name: string, status: string };

export function ReceiptGallery({
  receipts,
  canReview,
}: {
  receipts: ClaimReceipt[];
  canReview: boolean;
}) {
  const [selectedReceipt, setSelectedReceipt] = useState<ClaimReceipt | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {receipts.map((receipt) => (
        <Card
          key={receipt.id}
          className="cursor-pointer hover:border-zinc-500"
          onClick={() => setSelectedReceipt(receipt)}
        >
          <CardContent className="p-2">
            <div className="text-xs text-center truncate">{receipt.name}</div>
            <p className="text-xs mt-1 text-center font-semibold">
              {receipt.status}
            </p>
          </CardContent>
        </Card>
      ))}
      {selectedReceipt && (
        <ReviewReceiptModal
          receipt={selectedReceipt}
          canReview={canReview}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
