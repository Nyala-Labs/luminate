'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateClaim } from '@/app/dashboard/claims/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORIES = ["Event", "Miscellaneous", "Asset", "Operational"];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.string().min(1, "Amount is required"),
    category: z.enum(["Event", "Miscellaneous", "Asset", "Operational"], {
      message: "Please select a valid category",
    }),
  })).min(1, "At least one item is required"),
});

import { claims, claimItems } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

type Claim = InferSelectModel<typeof claims>;
type ClaimItem = InferSelectModel<typeof claimItems>;

// ...
export function EditClaimForm({ claim, items }: { claim: Claim, items: ClaimItem[] }) {
  const {
    register,
    handleSubmit,
    control,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: claim.title,
      description: claim.description || "",
      items: items.map(item => ({
        description: item.description,
        amount: item.amount,
        category: item.category as "Event" | "Miscellaneous" | "Asset" | "Operational",
      })),
    },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    const result = await updateClaim(claim.id, data);
    
    if (!result.success) {
      setLoading(false);
      console.error(result.error);
      alert(result.error || "Failed to update claim");
      return;
    }

    setLoading(false);
    router.push(`/dashboard/claims/${claim.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Title" {...register('title')} />
      <Textarea placeholder="Description" {...register('description')} />
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Items</h3>
        {itemFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input placeholder="Description" {...register(`items.${index}.description` as const)} />
            <Input
              placeholder="RM0.00"
              type="number"
              step="0.01"
              {...register(`items.${index}.amount` as const)}
            />
            <Controller
              control={control}
              name={`items.${index}.category` as const}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Button type="button" onClick={() => removeItem(index)} variant="destructive">Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={() => appendItem({ description: '', amount: '', category: 'Miscellaneous' })} variant="outline">Add Item</Button>
      </div>

      <Button type="submit" disabled={loading}>Update Claim</Button>
    </form>
  );
}
