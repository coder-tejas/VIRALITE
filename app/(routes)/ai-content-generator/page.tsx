"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import axios from "axios";
import { getRunOutput } from "@/services/GlobalApi";
import CopyText from "@/components/ui/CopyText";
import { Loader2 } from "lucide-react";

export default function AIContentGenerator() {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [videoTags, setVideoTags] = useState<string[]>([]);

  const OnSearch = async () => {
    try {
      setLoading(true);
      setError("");
      setDebugInfo("");
      setVideoTitle("");
      setVideoDescription("");
      setVideoTags([]);

      // Step 1: Trigger the AI content generation
      console.log("🔄 Starting AI content generation...");
      setDebugInfo("Step 1: Sending request to API...");
      
      const result = await axios.post("/api/ai-content-generator", {
        userInput: userInput
      });
      
      console.log("✅ API Response:", result.data);
      setDebugInfo(`Step 2: Got jobId: ${result.data.jobId}`);
      
      // Step 2: Get the job ID from the response
      const jobId = result.data.jobId;
      
      if (!jobId) {
        throw new Error("No job ID returned from the API");
      }

      console.log("🔄 Job started with ID:", jobId);
      setDebugInfo(`Step 3: Polling for completion...`);

      // Step 3: Poll for completion
      try {
        const completedRun = await getRunOutput(jobId);
        console.log("✅ Job completed:", completedRun);
        setDebugInfo(`Step 4: Job completed successfully`);

        // Step 4: Extract and set the results
        if (completedRun && completedRun.output) {
          const output = completedRun.output;
          console.log("📋 Raw output:", output);
          
          // The output should be an array from the database insert
          const contentData = Array.isArray(output) ? output[0] : output;
          
          if (contentData && contentData.content) {
            const { titles, description, tags } = contentData.content;
            console.log("📊 Parsed content:", { titles, description, tags });
            
            // Set the first title as video title
            if (titles && titles.length > 0) {
              setVideoTitle(titles[0].title);
              console.log("✅ Title set:", titles[0].title);
            }
            
            // Set description
            if (description) {
              setVideoDescription(description);
              console.log("✅ Description set");
            }
            
            // Set tags
            if (tags && Array.isArray(tags)) {
              setVideoTags(tags);
              console.log("✅ Tags set:", tags.length, "tags");
            }
            
            setDebugInfo("✅ Content generated successfully!");
          } else {
            console.warn("⚠️ Unexpected output format:", contentData);
            setError("Generated content format is unexpected. Check console for details.");
            setDebugInfo(`⚠️ Unexpected format. Output: ${JSON.stringify(contentData)}`);
          }
        } else {
          console.warn("⚠️ No output found in completed run:", completedRun);
          setError("No content was generated. Check console for details.");
          setDebugInfo(`⚠️ No output. Run: ${JSON.stringify(completedRun)}`);
        }
        
      } catch (pollError:any) {
        console.error("❌ Error while polling for results:", pollError);
        setError(`Polling error: ${pollError.message}`);
        setDebugInfo(`❌ Polling failed: ${pollError.message}`);
      }

    } catch (err: any) {
      console.error("❌ OnSearch error:", err);
      setError(`API Error: ${err.response?.data?.error || err.message}`);
      setDebugInfo(`❌ API Error: ${err.response?.status} - ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">AI Content Generator</h1>
        <p className="text-gray-500 mt-2">
          Generate engaging YouTube video scripts, titles, and descriptions
          instantly using AI. <br />✨ Boost your creativity and content output
          with smart, data-driven suggestions! 🎥
        </p>
      </div>

      {/* Search Section */}
      <div className="flex justify-center mb-10">
        <div className="flex w-full max-w-2xl gap-2">
          <Input
            placeholder="Enter value to generate content for your next video"
            value={userInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUserInput(e.target.value)
            }
            disabled={loading}
          />
          <Button
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            onClick={OnSearch}
            disabled={loading || !userInput.trim()}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="max-w-5xl mx-auto mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800 font-mono">{debugInfo}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-5xl mx-auto mb-6">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-red-600 font-medium">{error}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Title Suggestions */}
        <Card className="min-h-[150px]">
          <CardContent className="p-4 flex flex-col gap-3">
            <span className="text-lg font-semibold text-gray-600">
              YouTube Video Title Suggestion
            </span>
            {videoTitle ? (
              <CopyText text={videoTitle} />
            ) : (
              <p className="text-gray-400">No title generated yet</p>
            )}
          </CardContent>
        </Card>

        {/* Video Description */}
        <Card className="min-h-[150px]">
          <CardContent className="p-4 flex flex-col gap-3">
            <span className="text-lg font-semibold text-gray-600">
              YouTube Video Description
            </span>
            {videoDescription ? (
              <CopyText text={videoDescription} />
            ) : (
              <p className="text-gray-400">No description generated yet</p>
            )}
          </CardContent>
        </Card>

        {/* Video Tags */}
        <Card className="md:col-span-2 min-h-[150px]">
          <CardContent className="p-4 flex flex-col gap-3">
            <span className="text-lg font-semibold text-gray-600">
              YouTube Video Tags
            </span>
            {videoTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {videoTags.map((tag, index) => (
                  <CopyText text={tag} key={index} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No tags generated yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}