import { CreateClaimForm } from "@/components/claims/create-claim-form";

export default function NewClaimPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Claim</h1>
      <CreateClaimForm />
    </div>
  );
}
