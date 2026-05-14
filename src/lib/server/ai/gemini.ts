import { aiPrepSchema } from "$db/schema/preps";
import { GEMINI_API_KEYS } from "$env/static/private";
import { randomItem } from "$lib/helpers/arrays";
import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { cleanJson, getContent, getSystemPrompt } from "./helpers";

export const generateWithGemini = async (text: string, course: string) => {
  try {
    const schema = aiPrepSchema;

    const apiKey = randomItem(GEMINI_API_KEYS.split(";"));

    const ai = new GoogleGenAI({ apiKey });

    const config = {
      systemInstruction: getSystemPrompt(course),
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(schema),
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config,
      contents: getContent(text),
    });

    const raw = response.text;

    if (!raw) return [];

    const parsed = schema.safeParse(JSON.parse(cleanJson(raw)));

    if (!parsed.success) {
      console.log(parsed.error);
      return [];
    }

    return parsed.data.questions;
  } catch (error: any) {
    console.log({
      provider: "gemini",
      message: error.message,
    });
    return [];
  }
};
