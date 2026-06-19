"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Happening } from "@/lib/types/pulse";

interface PulseFiltersProps {
  happenings: Happening[];
  onFiltered: (filtered: Happening[]) => void;
}

export function PulseFilters({ happenings, onFiltered }: PulseFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const handleFilter = (newSearch: string, newCategory: string) => {
    let filtered = happenings;
    if (newSearch) {
      filtered = filtered.filter(h => 
        h.title.toLowerCase().includes(newSearch.toLowerCase()) ||
        h.description?.toLowerCase().includes(newSearch.toLowerCase())
      );
    }
    if (newCategory !== "all") {
      filtered = filtered.filter(h => h.category === newCategory);
    }
    onFiltered(filtered);
  };

  return (
    <div className="flex gap-4 mb-6">
      <Input 
        placeholder="Search happenings..." 
        onChange={(e) => { setSearch(e.target.value); handleFilter(e.target.value, category); }}
        className="max-w-xs"
      />
      <Select onValueChange={(val) => { setCategory(val); handleFilter(search, val); }} defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="event">Event</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="partnership">Partnership</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
