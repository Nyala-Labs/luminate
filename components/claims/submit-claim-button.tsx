'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { submitClaim } from '@/app/dashboard/claims/actions';
import { toast } from 'sonner';

export function SubmitClaimButton({ claimId }: { claimId: string }) {
  const { pending } = useFormStatus();

  const handleSubmit = async () => {
    try {
      await submitClaim(claimId);
      toast.success("Claim submitted to treasurer successfully");
    } catch {
      toast.error("Failed to submit claim");
    }
  };

  return (
    <form action={handleSubmit}>
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit to Treasurer"}
      </Button>
    </form>
  );
}
