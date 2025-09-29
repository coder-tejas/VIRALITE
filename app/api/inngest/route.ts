import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { GenerateAiCaleneder, GenerateAiThumbnail} from "../../../inngest/functions";
import { GenerateAiContent } from "../../../inngest/functions";
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    GenerateAiThumbnail,
    GenerateAiContent,
    GenerateAiCaleneder
  ],
});