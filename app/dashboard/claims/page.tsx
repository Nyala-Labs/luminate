import { db } from "@/db";
import { claims } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ClaimsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const userClaims = await db
    .select()
    .from(claims)
    .where(eq(claims.submittedBy, user.id));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Claims</h1>
        <Button>
          <Link href="/dashboard/claims/new">Create Claim</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {userClaims.length > 0 ? (
          userClaims.map((claim) => (
            <Link href={`/dashboard/claims/${claim.id}`} key={claim.id}>
              <Card className="hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>
                    {claim.title} - RM{claim.totalAmount}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Status: {claim.status}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p>No claims found.</p>
        )}
      </div>
    </div>
  );
}
