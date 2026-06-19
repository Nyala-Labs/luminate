"use client";

import { useState } from "react";
import { addSource } from "@/app/actions/pulse-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddSourceForm({ happeningId }: { happeningId: string }) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <form action={async (formData) => {
        setIsAdding(true);
        await addSource(happeningId, formData);
        setIsAdding(false);
    }} className="space-y-4 p-4 border rounded-xl bg-card">
      <h3 className="font-semibold">Add Source</h3>
      <Input name="title" placeholder="Title (e.g. Budget Proposal)" required />
      <Input name="url" placeholder="URL (e.g. https://drive.google.com/...)" required />
      
      <Select name="sourceType" defaultValue="manual">
        <SelectTrigger>
          <SelectValue placeholder="Source Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="google_drive">Google Drive</SelectItem>
          <SelectItem value="gmail">Gmail</SelectItem>
          <SelectItem value="external_link">External Link</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" disabled={isAdding}>
        {isAdding ? "Adding..." : "Add Source"}
      </Button>
    </form>
  );
}
