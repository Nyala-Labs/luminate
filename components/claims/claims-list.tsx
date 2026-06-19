import { getUserClaims } from "@/lib/claims/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export async function ClaimsList() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const userClaims = await getUserClaims(user.id);

  if (userClaims.length === 0) return <p>No claims found.</p>;

  return (
    <div className="grid gap-4">
      {userClaims.map((claim) => (
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
      ))}
    </div>
  );
}
