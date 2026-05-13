import { GROQ_AI_API_KEY as apiKey } from "$env/static/private";
import Groq from "groq-sdk";
import { cleanJson, getContent, SYSTEM_PROMPT } from "./helpers";
import { aiPrepSchema } from "./types";

export const GroqAiPreps = async (text: string) => {
  try {
    const schema = aiPrepSchema;

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3,

      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: getContent(text) },
      ],
    });

    const { content } = completion.choices[0]?.message;

    if (!content) return [];

    const parsed = schema.safeParse(JSON.parse(cleanJson(content)));

    if (!parsed.success) {
      console.log(parsed.error);
      return [];
    }

    return parsed.data.questions;
  } catch (error: any) {
    console.log({
      provider: "groq",
      message: error.message,
    });

    return [];
  }
};
