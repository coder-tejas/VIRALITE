"use client";
import { Card, CardContent } from "@/components/ui/card";

export function TagsBox() {
  const tags = ["AI", "Content", "YouTube", "SEO", "Automation"];
  return (
    <Card className="w-[200px]">
      <CardContent className="p-4 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
            {tag}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}
