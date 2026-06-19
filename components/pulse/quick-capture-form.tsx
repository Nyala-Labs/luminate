"use client";

import { createHappening } from "@/app/actions/pulse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function QuickCaptureForm() {
  return (
    <form action={createHappening} className="space-y-4 p-4 border rounded-xl bg-card">
      <h2 className="font-semibold text-lg">New Happening</h2>
      
      <Input name="title" placeholder="Title" required />
      <Textarea name="description" placeholder="Description" />
      
      <div className="grid grid-cols-2 gap-4">
        <Select name="category" defaultValue="general">
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
          </SelectContent>
        </Select>
        
        <Select name="status" defaultValue="idea">
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="idea">Idea</SelectItem>
            <SelectItem value="exploring">Exploring</SelectItem>
            <SelectItem value="pending_decision">Pending Decision</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select name="certainty" defaultValue="low">
          <SelectTrigger>
            <SelectValue placeholder="Certainty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Certainty</SelectItem>
            <SelectItem value="medium">Medium Certainty</SelectItem>
            <SelectItem value="high">High Certainty</SelectItem>
          </SelectContent>
        </Select>

        <Select name="visibility" defaultValue="public_org">
          <SelectTrigger>
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public_org">Public Org</SelectItem>
            <SelectItem value="team_only">Team Only</SelectItem>
            <SelectItem value="leadership">Leadership</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">Create Happening</Button>
    </form>
  );
}
