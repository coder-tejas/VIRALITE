"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import React, { useState } from "react";
import ThumbnailSearchList from "./_components/ThumbnailSearchList";
import { Skeleton } from "@/components/ui/skeleton";

export type VideoInfo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
};

function ThumbnailSearch() {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [videoList, setVideoList] = useState<VideoInfo[] | undefined>();
  const onSearch = async () => {
    setLoading(true);
    const result = await axios.get("/api/thumbnail-search?query=" + userInput);
    console.log(result.data, "from page.tsx");
    setVideoList(result.data);
    setLoading(false);
  };
  const SearchSimilarThumbnail = async (url: string): Promise<void> => {
    setLoading(true);
    const result = await axios.get("/api/thumbnail-search?thumbnailUrl=" + url);
    console.log(result.data, "from page.tsx");
    setVideoList(result.data);
    setLoading(false);
  };

  return (
    <>
      <div className="px-10 md:px-20 lg:px-40">
        <div className="flex items-center justify mt-20 flex-col gap-2 justify-center">
          <h2 className="font-bold text-4xl">AI Thumbnail Search</h2>
          <p className="text-gray-400 text-center">
            Discover thumbnails that match your content using smart AI-powered
            search. Just enter a title or keyword and get visually similar
            YouTube thumbnail in seconds
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <div className="max-w-2xl w-full p-2 rounded-xl flex gap-2 items-center bg-secondary">
          <input
            type="text"
            placeholder="Enter any value to search "
            className="w-full p-2 outline-none"
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button onClick={onSearch} disabled={loading || !userInput}>
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
            Search
          </Button>
        </div>
      </div>
      <div>
        {loading ? (
          <div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col space-y-3 border rounded-xl p-3 shadow"
                  >
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <ThumbnailSearchList
            videoList={videoList}
            SearchSimilarThumbnail={(url: string) => {
              SearchSimilarThumbnail(url);
            }}
          />
        )}
      </div>
    </>
  );
}

export default ThumbnailSearch;
