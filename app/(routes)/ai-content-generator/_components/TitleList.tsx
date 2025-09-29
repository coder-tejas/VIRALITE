"use client";
import { Button } from "@/components/ui/button";

export function TitleList() {
  const titles = ["Best AI Tools for Creators", "Boost Your SEO with AI", "Top 10 YouTube Growth Tips"];
  return (
    <div className="flex flex-col gap-2">
      {titles.map((title, index) => (
        <Button key={index} variant="outline" className="justify-start">
          {title}
        </Button>
      ))}
    </div>
  );
}
