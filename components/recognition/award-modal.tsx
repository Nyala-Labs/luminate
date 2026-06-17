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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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

export function RecognitionAwardModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  const [users, setUsers] = React.useState<any[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [tier, setTier] = React.useState<string>("");
  const [justification, setJustification] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      setLoading(true);
      const results = await searchUsers(query);
      setUsers(results);
      setLoading(false);
    } else {
      setUsers([]);
      setLoading(false);
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
      <DialogContent className="sm:max-w-xl bg-zinc-950 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 text-xl font-bold">
            New Recognition
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Selection Section */}
          <div className="space-y-2 flex flex-col">
            <label className="text-xs font-semibold text-zinc-500 uppercase">
              Recipient
            </label>
            <Popover open={userOpen} onOpenChange={setUserOpen}>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-zinc-900 border-zinc-800 text-zinc-400 h-12"
                >
                  {selectedUser
                    ? `${selectedUser.firstname} ${selectedUser.lastname}`
                    : "Search for a teammate..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[480px] p-0 bg-zinc-900 border-zinc-800">
                <Command>
                  <CommandInput
                    placeholder="Type to search..."
                    onValueChange={handleSearch}
                  />
                  <CommandList>
                    {loading && (
                      <div className="p-4 text-xs text-zinc-500 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />{" "}
                        Searching...
                      </div>
                    )}
                    {!loading && users.length === 0 && (
                      <CommandEmpty>No users found.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {users.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => {
                            setSelectedUser(user);
                            setUserOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedUser?.id === user.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {user.firstname} {user.lastname}{" "}
                          <span className="ml-2 text-zinc-500 text-xs">
                            ({user.email})
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Profile Summary */}
            {selectedUser && (
              <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl mt-2 animate-in fade-in duration-300">
                <div className="size-12 rounded-full bg-gradient-to-tr from-rose-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white shrink-0">
                  {selectedUser.firstname?.[0]}
                  {selectedUser.lastname?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-zinc-100">
                    {selectedUser.firstname} {selectedUser.lastname}
                  </p>
                  <p className="text-xs text-zinc-500">{selectedUser.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase">
                Recognition Tier
              </label>
              <Select
                value={tier}
                onValueChange={(value: string | null) =>
                  value && setTier(value)
                }
              >
                <SelectTrigger className="bg-zinc-900 w-full mt-2 h-12 border-zinc-800 text-zinc-200">
                  <SelectValue placeholder="Select Tier" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 p-2 border-zinc-800">
                  {Object.entries(TIER_CONFIG).map(([key, t]: any) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="text-zinc-200 focus:bg-zinc-800"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>{t.label}</span>
                        <span className="text-xs text-zinc-500">
                          {t.points} pts
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase">
              Justification
            </label>
            <Textarea
              placeholder="What did they do? Be specific about their impact..."
              className="bg-zinc-900 mt-2 min-h-[120px] resize-none border-zinc-800 text-zinc-200"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
            <p
              className={cn(
                "text-[10px]",
                justification.length < 50
                  ? "text-rose-500"
                  : "text-emerald-500",
              )}
            >
              {justification.length} / 50 characters minimum
            </p>
          </div>

          <Button
            className="w-full h-12 font-bold bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white"
            onClick={handleSubmit}
            disabled={justification.length < 50 || !selectedUser || !tier}
          >
            Submit Award
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
