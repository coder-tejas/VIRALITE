import axios from "axios";
import { openai } from "@/inngest/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let query = searchParams.get("query");
  const thumbnailUrl = searchParams.get("thumbnailUrl");

  if (thumbnailUrl) {
    const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Generate 5 YouTube tags for this image, comma-separated." },
        { type: "image_url", image_url: { url: `${thumbnailUrl}` } }
      ]
    }
  ],
  max_tokens: 30,
  temperature: 0
});

    const result  = completion.choices[0].message.content;
    query = result;
  }
  const result = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=20&key=${process.env.YOUTUBE_API_KEY}`
  );

  const searchData = result.data;
  const videoIds = searchData.items
    .map((item: any) => item.id.videoId) // ✅ fixed
    .join(",");

  console.log("videoIds -->", videoIds);

  const videoResult = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`
  );

  const videoResultData = videoResult.data;

  const FinalResult = videoResultData.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.high?.url,
    channelTitle: item.snippet.channelTitle,
    publishAt: item.snippet.publishedAt,
    viewCount: item.statistics.viewCount,
    likeCount: item.statistics.likeCount,
    commentCount: item.statistics.commentCount,
  }));

  return NextResponse.json(FinalResult);
}
