"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createClaim,
  uploadClaimReceipts,
} from "@/app/dashboard/claims/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORIES = ["Event", "Miscellaneous", "Asset", "Operational"];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        amount: z.string().min(1, "Amount is required"),
        category: z.enum(["Event", "Miscellaneous", "Asset", "Operational"], {
          message: "Please select a valid category",
        }),
      }),
    )
    .min(1, "At least one item is required"),
});

export function CreateClaimForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const { register, control, handleSubmit, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      items: [{ description: "", amount: "", category: "Miscellaneous" }],
    },
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form data submitted:", JSON.stringify(data, null, 2));
    if (!files || files.length === 0) {
      alert("Please upload at least one receipt");
      return;
    }
    setLoading(true);

    // 1. Create the claim record
    const result = await createClaim(data);
    if (!result.success || !result.claimId) {
      setLoading(false);
      console.error(result.error);
      return;
    }

    // ... inside onSubmit ...
    // 2. Upload files and link to claim
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    await uploadClaimReceipts(result.claimId, formData);

    setLoading(false);
    reset();
    toast.success("Claim created successfully");
    router.push(`/dashboard/claims/${result.claimId}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Title" {...register("title")} />
      <Textarea placeholder="Description" {...register("description")} />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Items</h3>
        {itemFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              placeholder="Description"
              {...register(`items.${index}.description`)}
            />
            <Input
              placeholder="RM0.00"
              type="number"
              step="0.01"
              {...register(`items.${index}.amount`)}
            />
            <Controller
              control={control}
              name={`items.${index}.category`}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            <Button
              type="button"
              onClick={() => removeItem(index)}
              variant="destructive"
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            appendItem({
              description: "",
              amount: "",
              category: "Miscellaneous",
            })
          }
          variant="outline"
        >
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Receipts</h3>
        <Input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
      </div>

      <Button type="submit" disabled={loading}>
        Submit Claim
      </Button>
    </form>
  );
}
