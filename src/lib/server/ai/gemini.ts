import { aiPrepSchema } from "$db/schema/preps";
import { GEMINI_API_KEYS } from "$env/static/private";
import { randomItem } from "$lib/helpers/arrays";
import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { cleanJson, getSysPrompt, transformTopics } from "./helpers";

export const generateWithGemini = async (file: File) => {
  try {
    const schema = aiPrepSchema;

    const apiKey = randomItem(GEMINI_API_KEYS.split(";"));

    const ai = new GoogleGenAI({ apiKey });

    const mimeType = "application/pdf";

    const uploaded = await ai.files.upload({ file, config: { mimeType } });

    const config = {
      systemInstruction: getSysPrompt(),
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(schema),
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config,
      contents: [
        { fileData: { fileUri: uploaded.uri, mimeType } },
        { text: "Generate quiz questions from this PDF." },
      ],
    });

    const raw = response.text;

    if (!raw) return { questions: [], topics: [] };

    const { data, success, error } = schema.safeParse(
      JSON.parse(cleanJson(raw)),
    );

    if (!success) {
      console.log(error);
      return { questions: [], topics: [] };
    }

    return { questions: data.questions, topics: transformTopics(data.topics) };
  } catch (error: any) {
    console.log({
      provider: "gemini",
      message: error.message,
    });
    return { questions: [], topics: [] };
  }
};
