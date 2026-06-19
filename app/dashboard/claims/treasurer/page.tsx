import { db } from "@/db";
import { claims } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser, hasRole } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TreasurerDashboardPage() {
  const user = await getCurrentUser();
  if (!user || !(await hasRole('treasurer'))) redirect('/dashboard');

  const pendingClaims = await db.select().from(claims).where(or(eq(claims.status, 'TREASURER_REVIEW'), eq(claims.status, 'SUBMITTED')));
  const waitingClaims = await db.select().from(claims).where(eq(claims.status, 'WAITING_FOR_PAYMENT'));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Treasurer Dashboard</h1>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Pending Review</h2>
        {pendingClaims.length === 0 ? (
          <p className="text-zinc-500">No pending claims.</p>
        ) : (
          <div className="grid gap-4">
            {pendingClaims.map((claim) => (
              <Card key={claim.id}>
                <CardHeader>
                  <CardTitle>{claim.title} - RM{claim.totalAmount}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/dashboard/claims/treasurer/submitted/${claim.id}`}>
                    <Button variant="outline">Review Claim</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Waiting for Payment</h2>
        {waitingClaims.length === 0 ? (
          <p className="text-zinc-500">No claims waiting for payment.</p>
        ) : (
          <div className="grid gap-4">
            {waitingClaims.map((claim) => (
              <Card key={claim.id}>
                <CardHeader>
                  <CardTitle>{claim.title} - RM{claim.totalAmount}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/dashboard/claims/treasurer/submitted/${claim.id}`}>
                    <Button variant="outline">View Detail & Pay</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
