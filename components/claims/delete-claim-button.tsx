'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteClaim } from "@/app/dashboard/claims/actions";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

export function DeleteClaimButton({ claimId }: { claimId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this draft claim?")) return;
    
    setLoading(true);
    try {
      await deleteClaim(claimId);
      toast.success("Claim deleted successfully");
      router.push('/dashboard/claims');
    } catch {
      toast.error("Failed to delete claim");
      setLoading(false);
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
      Delete
    </Button>
  );
}
