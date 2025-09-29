"use client";

import { RunStatus } from "@/services/GlobalApi";
import axios from "axios";
import { ArrowUp, ImagePlus, Loader2, User, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type UploadField = "referenceImageUpload" | "userImageUpload";

function AiThumbnailGenerator(): React.ReactElement {
  const [userInput, setUserInput] = useState<string>("");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] =
    useState<string>("");
  const [userImagePreview, setUserImagePreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [outputThumbnailImage, setOutputThumbnailImage] =
    useState<HTMLImageElement>();
  const handleImageUpload = (
    field: UploadField,
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image.");
      return;
    }

    const imageURL = URL.createObjectURL(selectedFile);

    if (field === "referenceImageUpload") {
      setReferenceImage(selectedFile);
      setReferenceImagePreview(imageURL);
    } else {
      setUserImage(selectedFile);
      setUserImagePreview(imageURL);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    userInput && formData.append("userInput", userInput);
    referenceImage && formData.append("referenceImage", referenceImage);
    userImage && formData.append("userImage", userImage);
    try {
      const result = await axios.post("/api/generate-thumbnail", formData);
      console.log(result.data);
      while (true) {
        const runStatus = await RunStatus(result.data.runId);
        if (runStatus && runStatus[0]?.status == "Completed") {
          console.log(runStatus.data, "hheheh");
          setOutputThumbnailImage(runStatus[0].output);
          setLoading(false);
          break;
        }
        if (runStatus && runStatus[0]?.status == "Cancelled") {
          setLoading(false);
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    // .catch((error)=>{console.error(error)})
  };

  return (
    <div className="px-10 md:px-20 lg:px-40">
      <div className="flex items-center justify mt-20 flex-col gap-2 justify-center">
        <h2 className="font-bold text-4xl">AI Thumbnail Generator</h2>
        <p className="text-gray-400 text-center">
          Generate catchy YouTube thumbnails with AI
        </p>
      </div>
      <div>
        {" "}
        {loading ? (
          <div className="w-full bg-secondary border rounded-2xl p-10 h-[250px] flex items-center justify-center mt-6 ">
            <Loader2 className="animate-spin" />

            <h2>Please wait... Thumbnail is generating</h2>
          </div>
        ) : (
          <div>
            {outputThumbnailImage && (
              <Image
                src={outputThumbnailImage}
                alt="Thumbnail"
                width={500}
                height={400}
                className="
          aspect-video w-full
          "
              />
            )}
          </div>
        )}
      </div>
      <div className="flex gap-5 items-center p-3 border rounded-xl mt-10 bg-secondary">
        <textarea
          placeholder="Enter your YouTube video title or description"
          className="w-full outline-0 bg-transparent resize-none"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div
          className="p-3 bg-gradient-to-t from-red-500 to-orange-500 rounded-full cursor-pointer hover:scale-105 transition-transform"
          onClick={onSubmit}
        >
          <ArrowUp />
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        {/* Reference Image Upload */}
        <label htmlFor="referenceImageUpload" className="w-full cursor-pointer">
          {!referenceImagePreview ? (
            <div className="p-6 w-full border rounded-xl mt-2 bg-secondary flex gap-3 items-center justify-center hover:scale-105 transition-all text-xl">
              <ImagePlus />
              <h2>Reference Image</h2>
            </div>
          ) : (
            <div className="relative w-fit">
              <X
                className="absolute top-[-10px] right-[-10px] bg-white rounded-full cursor-pointer"
                onClick={() => {
                  setReferenceImage(null);
                  setReferenceImagePreview("");
                }}
              />
              <Image
                src={referenceImagePreview}
                alt="Reference Preview"
                width={100}
                height={100}
                className="w-[70px] h-[70px] object-cover rounded-sm"
              />
            </div>
          )}
        </label>
        <input
          type="file"
          id="referenceImageUpload"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload("referenceImageUpload", e)}
        />

        {/* User Image Upload */}
        <label htmlFor="userImageUpload" className="w-full cursor-pointer">
          {!userImagePreview ? (
            <div className="p-6 w-full border rounded-xl mt-2 bg-secondary flex gap-3 items-center justify-center hover:scale-105 transition-all text-xl">
              <User />
              <h2>User Image</h2>
            </div>
          ) : (
            <div className="relative w-fit">
              <X
                className="absolute top-[-10px] right-[-10px] bg-white rounded-full cursor-pointer"
                onClick={() => {
                  setUserImage(null);
                  setUserImagePreview("");
                }}
              />
              <Image
                src={userImagePreview}
                alt="User Preview"
                width={100}
                height={100}
                className="w-[70px] h-[70px] object-cover rounded-sm"
              />
            </div>
          )}
        </label>
        <input
          type="file"
          id="userImageUpload"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload("userImageUpload", e)}
        />
      </div>
    </div>
  );
}

export default AiThumbnailGenerator;
