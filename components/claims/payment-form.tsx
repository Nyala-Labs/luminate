'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitPayment } from "@/app/dashboard/claims/actions";
import { toast } from 'sonner';

export function PaymentForm({ claimId }: { claimId: string }) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await submitPayment(claimId, formData);
    setLoading(false);
    toast.success("Payment proof submitted successfully");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 border rounded">
      <h3 className="text-lg font-semibold">Upload Payment Proof</h3>
      <Input type="file" name="file" required />
      <Button type="submit" disabled={loading}>Submit Payment Proof</Button>
    </form>
  );
}
