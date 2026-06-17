"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchUsers, submitAward } from "@/app/dashboard/recognition/actions";

const TIER_CONFIG = {
  SPARK: { points: 5, label: "Spark", approvalRequired: false },
  HELPER: { points: 25, label: "Helper", approvalRequired: false },
  BUILDER: { points: 100, approvalRequired: true },
  CATALYST: { points: 225, approvalRequired: true },
  ARCHITECT: { points: 400, approvalRequired: true },
  LUMINARY: { points: 600, approvalRequired: true },
};

export function RecognitionAwardModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  const [users, setUsers] = React.useState<any[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [tier, setTier] = React.useState<string>("");
  const [justification, setJustification] = React.useState("");

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      const results = await searchUsers(query);
      setUsers(results);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("receiverId", selectedUser?.id);
    formData.append("tierId", tier);
    formData.append("justification", justification);
    await submitAward(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-950 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Award Recognition</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Popover open={userOpen} onOpenChange={setUserOpen}>
            <PopoverTrigger>
              <Button variant="outline" className="w-full justify-between bg-zinc-900 border-zinc-800 text-zinc-400">
                {selectedUser ? `${selectedUser.firstname} ${selectedUser.lastname}` : "Select teammate..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-zinc-900 border-zinc-800">
              <Command>
                <CommandInput placeholder="Search teammate..." onValueChange={handleSearch} />
                <CommandList>
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem key={user.id} onSelect={() => { setSelectedUser(user); setUserOpen(false); }}>
                        <Check className={cn("mr-2 h-4 w-4", selectedUser?.id === user.id ? "opacity-100" : "opacity-0")} />
                        {user.firstname} {user.lastname}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Select value={tier} onValueChange={(value: string | null) => value && setTier(value)}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-400">
              <SelectValue placeholder="Select Tier" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {Object.entries(TIER_CONFIG).map(([key, t]: any) => (
                <SelectItem key={key} value={key}>
                  {t.label} ({t.points} pts)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea 
            placeholder="Justification (min 50 chars)..." 
            className="bg-zinc-900 border-zinc-800 text-zinc-200"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          />
          <Button className="w-full" onClick={handleSubmit} disabled={justification.length < 50 || !selectedUser || !tier}>
            Submit Award
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
