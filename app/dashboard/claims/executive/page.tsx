import { db } from "@/db";
import { claims } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser, hasRole } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ExecutiveDashboardPage() {
  const user = await getCurrentUser();
  if (!user || !(await hasRole('executive'))) redirect('/dashboard');

  const pendingClaims = await db.select().from(claims).where(eq(claims.status, 'EXECUTIVE_REVIEW'));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Executive Dashboard</h1>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Escalated Claims (Review Required)</h2>
        {pendingClaims.length === 0 ? (
          <p className="text-zinc-500">No pending escalated claims.</p>
        ) : (
          <div className="grid gap-4">
            {pendingClaims.map((claim) => (
              <Card key={claim.id}>
                <CardHeader>
                  <CardTitle>{claim.title} - RM{claim.totalAmount}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/dashboard/claims/executive/review/${claim.id}`}>
                    <Button variant="outline">Review Claim</Button>
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
