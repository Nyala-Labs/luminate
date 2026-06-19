"use client";

import { useState } from "react";
import { addUpdate } from "@/app/actions/pulse-detail";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AddUpdateForm({ happeningId }: { happeningId: string }) {
  const [body, setBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  return (
    <form action={async () => { 
      setIsPosting(true);
      await addUpdate(happeningId, body); 
      setBody(""); 
      setIsPosting(false);
    }} className="space-y-2 mt-4">
      <Textarea 
        value={body} 
        onChange={(e) => setBody(e.target.value)} 
        placeholder="Add an update..." 
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isPosting || !body.trim()}>
        {isPosting ? "Posting..." : "Post Update"}
      </Button>
    </form>
  );
}
