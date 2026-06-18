import { db } from "@/db";
import { claims, claimItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditClaimForm } from "@/components/claims/edit-claim-form";

export default async function EditClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [claim] = await db.select().from(claims).where(eq(claims.id, id));
  if (!claim || claim.status !== 'DRAFT') notFound();

  const items = await db.select().from(claimItems).where(eq(claimItems.claimId, id));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Claim</h1>
      <EditClaimForm claim={claim} items={items} />
    </div>
  );
}
