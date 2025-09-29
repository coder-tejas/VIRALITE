"use client";
import { Card, CardContent } from "@/components/ui/card";

export function ThumbnailGrid() {
  const thumbnails = ["/thumb1.jpg", "/thumb2.jpg"]; // Replace with real data
  return (
    <div className="flex gap-4">
      {thumbnails.map((thumb, index) => (
        <Card key={index} className="w-[150px] h-[100px] overflow-hidden">
          <CardContent className="p-0">
            <img src={thumb} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
