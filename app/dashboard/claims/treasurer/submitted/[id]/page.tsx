import { db } from "@/db";
import { claims, claimPayments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/server";
import { getClaimReceipts } from "../../../actions";
import { ReceiptGallery } from "@/components/claims/receipt-gallery";
import { PaymentForm } from "@/components/claims/payment-form";
import { ReviewControls } from "@/components/claims/review-controls";

export default async function TreasurerReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const [claim] = await db.select().from(claims).where(eq(claims.id, id));
  const receipts = await getClaimReceipts(id);
  const [payment] = await db.select().from(claimPayments).where(eq(claimPayments.claimId, id));
  
  if (!claim) notFound();
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Review Claim: {claim.title}</CardTitle>
          {(claim.status === "TREASURER_REVIEW" || claim.status === "SUBMITTED") && (
            <ReviewControls claim={claim} userId={user!.id} />
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Status: {claim.status}</p>
          <p>Total Amount: RM{claim.totalAmount}</p>
          <p>Description: {claim.description}</p>
          
          <h3 className="font-semibold">Receipts (Click to Review)</h3>
          <ReceiptGallery
            receipts={receipts}
            canReview={claim.status === "TREASURER_REVIEW" || claim.status === "SUBMITTED"}
          />
          
          {claim.status === "WAITING_FOR_PAYMENT" && (
            <PaymentForm claimId={claim.id} />
          )}

          {payment && (
            <div className="mt-4">
              <h3 className="font-semibold">Payment Proof</h3>
              <a href={payment.proofDriveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Payment Proof
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
