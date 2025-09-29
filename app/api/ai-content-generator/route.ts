import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        console.log("Received POST request for AI content generation");

        const body = await req.json();
        const userInput = body.userInput; 
        const user = await currentUser();

        if (!userInput) {
            return NextResponse.json({ error: "Missing userInput" }, { status: 400 });
        }

        const result = await inngest.send({
            name: "ai/generateContent",
            data: {
                userInput,
                userEmail: user?.primaryEmailAddress?.emailAddress
            }
        }) 
        console.log("FROM INNGEST ------>", result);
        
        return NextResponse.json({ "jobId": result.ids[0] });
    } catch (error) {
        console.error("Error in AI content generation API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}