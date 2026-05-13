import { extractText } from "unpdf";

export const pdfExtraction = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await extractText(new Uint8Array(arrayBuffer));

  return pdf.text
    .join("\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const cleanJson = (text: string) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const getContent = (text: string) => {
  return `Generate quiz questions from the following content: ${text}`;
};

export const SYSTEM_PROMPT = `You are a quiz generator.

Generate 20 to 25 multiple-choice questions from the provided text.

Return ONLY valid JSON.

Each item must contain:
- title: string
- options: string[]
- answerIndex: number
- explanation: string

Rules:
- options must contain 3 choices
- answerIndex must match the correct option
- no markdown
- no extra commentary
`;
