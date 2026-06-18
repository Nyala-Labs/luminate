import { db } from "@/db";
import { claims } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser, hasRole } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { approveClaim } from "../actions";

export default async function TreasurerDashboardPage() {
  const user = await getCurrentUser();
  if (!user || !(await hasRole('treasurer'))) redirect('/dashboard');

  const pendingClaims = await db.select().from(claims).where(eq(claims.status, 'SUBMITTED'));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Treasurer Dashboard</h1>
      {pendingClaims.length === 0 ? (
        <div className="flex items-center justify-center h-32 w-full bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800 p-5 text-center">
          <p className="text-zinc-500 text-sm">No pending claims for treasurer review.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingClaims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader>
                <CardTitle>{claim.title} - RM{claim.totalAmount}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Submitted by: {claim.submittedBy}</p>
                <form action={approveClaim.bind(null, claim.id, user.id, "Approved by Treasurer")}>
                  <Button type="submit">Approve</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
