import { inngest } from "./client";
import ImageKit from "imagekit";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { generatingAIThumbnailFromInput } from "@/replicate";
import { db } from "@/configs/db";
import { AiContentTable, AiThumbnail } from "@/configs/schema"; // ✅ Make sure both are imported
import moment from "moment";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: "https://ik.imagekit.io/badassCodes",
});

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
const ai = new GoogleGenAI({});

const PROMPT = `
> You are an expert YouTube SEO strategist and AI creative assistant. Based on the user input below, generate a JSON response only (no explanation, no markdown, no commentary), containing:
> 1. Three YouTube video titles optimized for SEO.
> 2. SEO Score for each title (1 to 100).
> 3. A compelling YouTube video description based on the topic.
> 4. 10 relevant YouTube video tags.
> 5. Two YouTube thumbnail image prompts, each including:
>    -  Professional illustration style based on the title
>    -  A short 3-5 word heading that will appear on the thumbnail image
>    -  Visually compelling layout concept to grab attention
> 
> User Input: {{user_input}}
> Return format (JSON only):
>
> {
>   "titles": [
>     {
>       "title": "Title 1",
>       "seo_score": 87
>     },
>     {
>       "title": "Title 2",
>       "seo_score": 82
>     },
>     {
>       "title": "Title 3",
>       "seo_score": 78
>     }
>   ],
>   "description": "Write a professional and engaging YouTube video description here based on the input.",
>   "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
>   "image_prompts": [
>     {
>       "heading": "Heading Text 1",
>       "prompt": "Professional illustration for thumbnail image based on Title 1. Include elements such as..."
>     },
>     {
>       "heading": "Heading Text 2",
>       "prompt": "Professional illustration for thumbnail image based on Title 2. Include elements such as..."
>     }
>   ]
> }
>
> Make sure the thumbnail image prompt reflects the respective title context, includes visual style (3D/flat/vector), character/action/objects (if needed), background design, and text position ideas.
`

export const GenerateAiThumbnail = inngest.createFunction(
  { id: "ai/generate-thumbnail" },
  { event: "ai/generate-thumbnail" },
  async ({ event, step }) => {
    const { userInput, referenceImage, userImage, userEmail } = event.data;

    // HOSTING THE IMAGE ON IMAGEKIT AND FORWARDING THE LINK OF IMAGE HOSTED TO THE PROMPT GENERATION
    const uploadImageUrls = await step.run("UploadImage", async () => {
      if (referenceImage != null) {
        const referenceImageUrl = await imagekit.upload({
          file: referenceImage.base64,
          fileName: referenceImage.name,
          useUniqueFileName: true,
        });

        return { referenceImageUrl };
      }
      return null;
    });

    // GENERATING AI PROMPT FOR IMAGE GENERATION FROM GEMINI MODEL
    const GenerateThumbnailPrompt = await step.run("generateThumbnailPrompt", async () => {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: uploadImageUrls
                  ? `You are a professional YouTube thumbnail designer.
Given the reference image and the user's input: "${userInput}", write a detailed, vivid, high-quality text prompt that describes a YouTube thumbnail design for an AI image generation model.
Include subject, background, colors, lighting, emotions, icons, illustration style, and vibe.
Respond only with the prompt — no extra commentary.`
                  : `You are a professional YouTube thumbnail designer.
Based on the user's input: "${userInput}", write a detailed, vivid, high-quality text prompt that describes a YouTube thumbnail design for an AI image generation model.
Include subject, background, colors, lighting, emotions, icons, illustration style, and vibe.
Respond only with the prompt — no extra commentary.`,
              },  //@ts-ignore
              ...(uploadImageUrls
                ? [
                  {
                    type: "image_url",
                    image_url: {
                      url: uploadImageUrls.referenceImageUrl?.url ?? "",
                    },
                  },
                ]
                : []),
            ],
          },
        ],
      });
      return completion.choices[0].message.content as string;
    });

    // Generating Thumbnail from Prompt Generated
    const thumbnailOutput = await step.run("Generating Ai Thumbnail", async () => {
      return await generatingAIThumbnailFromInput({
        prompt: GenerateThumbnailPrompt,
        aspect_ratio: "16:9",
        output_format: "png",
        safety_feature: "block_only_high"
      });
    });

    // SAVE RECORD TO DB
    const SaveToDB = await step.run("SaveToDB", async () => {
      const result = await db.insert(AiThumbnail).values({
        userInput: userInput,
        thumbnailUrl: thumbnailOutput, // ✅ Fixed: Use actual thumbnail output
        createdOn: moment().format('YYYY-MM-DD'), // ✅ Fixed: Correct date format
        refImage: uploadImageUrls?.referenceImageUrl?.url,
        userEmail: userEmail
      }).returning();

      return result;
    });

    return SaveToDB;
  }
);

export const GenerateAiContent = inngest.createFunction(
  { id: 'ai/generateContent' },
  { event: 'ai/generateContent' },
  async ({ event, step }) => {
    const { userInput, userEmail } = event.data;

    // To generate Title, Description, Tags and Thumbnail Prompt
    const generateAiContent = await step.run('GenerateAiContent', async () => {
      const prompt = PROMPT.replace('{{user_input}}', userInput);
      console.log("Generated prompt:", prompt);

      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash",
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const rawJson = completion.choices[0].message.content;
      console.log("Raw AI response:", rawJson);

      if (!rawJson) {
        throw new Error("No response from AI model");
      }

      try {
        let formattedJsonString = rawJson
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();

        const formattedJson = JSON.parse(formattedJsonString);
        console.log("Parsed JSON:", formattedJson);
        return formattedJson;
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw response that failed to parse:", rawJson);
        throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
      }
    });

    // Save Uploaded Image to DB
    const SaveToDB = await step.run("SaveToDB", async () => {
      try {
        const result = await db.insert(AiContentTable).values({
          userInput: userInput,
          content: generateAiContent,
          createdOn: moment().format('YYYY-MM-DD'), // ✅ Fixed: Correct date format
          userEmail: userEmail,
          thumbnailUrl: "thumbnail url" // ✅ You might want to make this null or optional
        }).returning();

        console.log("Database insert result:", result);
        return result;
      } catch (dbError) {
        console.error("Database insert error:", dbError);
        throw new Error(`Failed to save to database: ${dbError}`);
      }
    });

    console.log("Final result:", SaveToDB);
    return SaveToDB;
  }
);
export const GenerateAiCaleneder = inngest.createFunction(
  { id: "ai/generate-calender" },
  { event: "ai/generate-calender" },
  async ({ event, step }) => {
    const { userInput, userEmail } = event.data
    console.log("Event data ->  ", event.data);

    const generateCalender = await step.run('GenerateAiCalender', async () => {
      console.log(`${userInput.ContentType}`);

      const today = new Date().toISOString().split("T")[0]; // "2025-09-29"

      const prompt = `
You are an AI Youtube strategist.

Using the following user inputs:

- Content type of my channel: ${userInput.ContentType}
- Target audience (age group) of viewers: ${userInput.TargetAudience}
- Location of my viewers: ${userInput.Location}
- Goal I am targeting: ${userInput.Goals}
- Posting frequency/week : ${userInput.PostingFrequency}

Generate a 1-month content calendar starting from ${today} for the upcoming 30 days.

Rules:
- Return ONLY valid JSON (no text, no explanations, no markdown).
- The JSON must contain an "events" array.
- Each event object must follow exactly this format:
  {
    "id": "string",
    "start": "YYYY-MM-DDTHH:MM:SS",
    "end": "YYYY-MM-DDTHH:MM:SS",
    "title": "string"
  }

- start and end must be full ISO datetime strings.
- Number of events must match the posting frequency.
- Titles should reflect the content type and goal.

Return ONLY JSON.
`;

      // console.log("Genrated Prompt: ", prompt);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      console.log("Generated From GEmini api ---- >", response.text);

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("No response from AI model");
      }

      try {
        let formattedJsonString = rawJson
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();

        const formattedJson = JSON.parse(formattedJsonString);
        console.log("Parsed JSON:", formattedJson);
        return formattedJson;
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw response that failed to parse:", rawJson);
        throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
      }

    })
    return generateCalender;
  }
)