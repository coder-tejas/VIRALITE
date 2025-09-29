import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        console.log("Received POST req for content calender");
        const body = await req.json();
        // console.log("here --->>> ",body);
        
        const userInput = body.userInput;
        const user = await currentUser();
        console.log("Req Received from client--->   ",req);
        
        if (!userInput) {
            
            return NextResponse.json({ error: "Missing user input" }, { status: 400 })
        }
        const result = await inngest.send({
            name:"ai/generate-calender",
            data:{
                userInput,
                userEmail:user?.primaryEmailAddress?.emailAddress
            }
        })
        console.log("Received From inngest --> ",result);
        return NextResponse.json({"jobId":result.ids[0]})
        

    } catch (error) {
        console.error("Error in AI content calender API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}