import { db } from "@/configs/db";
import { AiThumbnail } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { StringToBoolean } from "class-variance-authority/types";
import { NextRequest, NextResponse } from "next/server";

type UploadableFile = {
  name: string;
  base64: string;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const referenceImage = formData.get("referenceImage") as File | null;
  const userImage = formData.get("userImage") as File | null;
  const userInput = formData.get("userInput") as String;
  const user = await currentUser();

  const inputData = {
    userInput,
    referenceImage: referenceImage
      ? await getFileBufferData(referenceImage)
      : null,
    userImage: userImage ? await getFileBufferData(userImage) : null,
    userEmail: user?.primaryEmailAddress?.emailAddress,
  };

  const result = await inngest.send({
    name: "ai/generate-thumbnail",
    data: inputData,
  });

  return NextResponse.json({ runId: result.ids[0] });
}

const getFileBufferData = async (file: File): Promise<UploadableFile> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return {
    name: file.name,
    base64: `data:${file.type};base64,${buffer.toString("base64")}`,
  };
};

export async function GET(req: NextRequest) {
  const user = await currentUser();
  const result = await db
    .select()
    .from(AiThumbnail) //@ts-ignore
    .where(eq(AiThumbnail.userEmail, user?.primaryEmailAddress?.emailAddress));

    return NextResponse.json(result)
    }
