import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Thumbnail = {
  id: number;
  thumbnailUrl: string;
  refImage: string;
  userInput: string;
};

function ThumbnailList() {
  const [thumbnailList, setThumbnailList] = useState<Thumbnail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetThumbnailList();
  }, []);

  const GetThumbnailList = async () => {
    setLoading(true);
    const result = await axios.get<Thumbnail[]>("/api/generate-thumbnail");
    setThumbnailList(result.data);
    setLoading(false);
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl">Previously Generated Thumbnail</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {!loading
          ? thumbnailList.map((thumbnail, index) => (
              <div key={index}>
                <Link href={thumbnail.thumbnailUrl} target="_blank">
                  <Image
                    src={thumbnail.thumbnailUrl}
                    alt={thumbnail.thumbnailUrl}
                    width={200}
                    height={200}
                    className="w-full aspect-video rounded-xl"
                  />
                </Link>
              </div>
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div className="flex flex-col space-y-3" key={index}>
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default ThumbnailList;
