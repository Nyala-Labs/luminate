import { db } from "@/db";
import { claims, claimPayments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getClaimReceipts } from "../actions";
import { ReceiptGallery } from "@/components/claims/receipt-gallery";
import { DeleteClaimButton } from "@/components/claims/delete-claim-button";
import { SubmitClaimButton } from "@/components/claims/submit-claim-button";

export default async function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [claim] = await db.select().from(claims).where(eq(claims.id, id));
  const receipts = await getClaimReceipts(id);
  const [payment] = await db.select().from(claimPayments).where(eq(claimPayments.claimId, id));
  
  if (!claim) notFound();
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{claim.title}</CardTitle>
          <div className="flex gap-2">
            {claim.status === 'DRAFT' && (
              <>
                <Link href={`/dashboard/claims/${claim.id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <DeleteClaimButton claimId={claim.id} />
                <SubmitClaimButton claimId={claim.id} />
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Status: {claim.status}</p>
          <p>Total Amount: RM{claim.totalAmount}</p>
          <p>Description: {claim.description}</p>
          
          <h3 className="font-semibold">Receipts</h3>
          <ReceiptGallery receipts={receipts} canReview={false} />

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

