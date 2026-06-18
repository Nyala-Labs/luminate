import { db } from "@/db";
import { claims } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitClaim } from "../actions";

export default async function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [claim] = await db.select().from(claims).where(eq(claims.id, id));

  if (!claim) notFound();

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{claim.title}</CardTitle>
          {claim.status === 'DRAFT' && (
            <form action={submitClaim.bind(null, claim.id)}>
              <Button type="submit">Submit to Treasurer</Button>
            </form>
          )}
        </CardHeader>
        <CardContent>
          <p>Status: {claim.status}</p>
          <p>Total Amount: RM{claim.totalAmount}</p>
          <p>Description: {claim.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
