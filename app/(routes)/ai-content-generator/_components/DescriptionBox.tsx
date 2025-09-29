"use client";
import { Card, CardContent } from "@/components/ui/card";

export function DescriptionBox() {
  return (
    <Card className="w-[400px] h-[150px]">
      <CardContent className="p-4 text-gray-700">
        Here will be the AI-generated description for your video content.
      </CardContent>
    </Card>
  );
}
