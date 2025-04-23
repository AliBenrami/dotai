import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// You'll need to replace this with your actual API key
export const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
});
