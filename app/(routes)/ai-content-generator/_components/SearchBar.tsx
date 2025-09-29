"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  return (
    <div className="flex gap-2 w-full max-w-lg">
      <Input placeholder="Enter your keyword..." />
      <Button className="bg-red-500 hover:bg-red-600 text-white">Search</Button>
    </div>
  );
}
