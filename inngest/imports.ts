// imports.ts
import { inngest } from "./client";
import ImageKit from "imagekit";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import moment from "moment";

dotenv.config();

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: "https://ik.imagekit.io/badassCodes",
});

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
