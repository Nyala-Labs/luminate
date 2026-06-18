import { db } from "@/db";
import { claims } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/server";
import { getClaimReceipts } from "@/app/dashboard/claims/actions";
import { ReceiptGallery } from "@/components/claims/receipt-gallery";
import { ExecutiveControls } from "@/components/claims/executive-controls";

export default async function ExecutiveReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const [claim] = await db.select().from(claims).where(eq(claims.id, id));
  const receipts = await getClaimReceipts(id);
  
  if (!claim) notFound();
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Review Escalated Claim: {claim.title}</CardTitle>
          {claim.status === "EXECUTIVE_REVIEW" && (
            <ExecutiveControls claim={claim} userId={user!.id} />
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Status: {claim.status}</p>
          <p>Total Amount: RM{claim.totalAmount}</p>
          <p>Description: {claim.description}</p>
          
          <h3 className="font-semibold">Receipts (Click to View)</h3>
          <ReceiptGallery
            receipts={receipts}
            canReview={false} // Executives approve the claim, not individual receipts
          />
        </CardContent>
      </Card>
    </div>
  );
}
