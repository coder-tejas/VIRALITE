import React from "react";
import { VideoInfo } from "../page";
import Image from "next/image";
import { Eye, ThumbsUp } from "lucide-react";

type props = {
  videoInfo: VideoInfo;
};

function VideoCard({ videoInfo }: props) {
 
  return (
    <div>
      <div className="p-3 border rounded-2xl ">
        <Image
          src={videoInfo.thumbnail}
          alt={videoInfo.title}
          width={300}
          height={300}
          className="rounded-xl object-cover aspect-video"
        />
        <h2>{videoInfo.title}</h2>
        <h2 className="text-xs text-gray-400">{videoInfo.channelTitle}</h2>
      </div>
      <div className="flex justify-center items-center mt-1 ">

      <h2 className="flex gap-2 items-center text-xs  text-gray-400">
        <Eye className="h-4 w-4" />
        {videoInfo.viewCount}
      </h2>
      <h2 className="flex gap-2 items-center text-xs  text-gray-400">
        <ThumbsUp className="h-4 w-4" />
        {videoInfo.likeCount}
      </h2>
      </div>
    </div>
  );
}

export default VideoCard;
