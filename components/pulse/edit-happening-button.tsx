"use client";

import { editHappening } from "@/app/actions/pulse-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Happening } from "@/lib/types/pulse";

export function EditHappeningButton({ happening }: { happening: Happening }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Happening</DialogTitle>
        </DialogHeader>
        <form action={async (formData) => { await editHappening(happening.id, formData); }} className="space-y-4">
          <Input name="title" defaultValue={happening.title} required />
          <Textarea name="description" defaultValue={happening.description || ""} />
          
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
