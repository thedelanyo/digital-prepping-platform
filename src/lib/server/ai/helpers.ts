import { extractText, getDocumentProxy } from "unpdf";

const cleanup = (text: string) => {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const pdfExtraction = async (file: File) => {
  const MAX = 100_000;

  const buffer = await file.arrayBuffer();
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  let { text } = await extractText(pdf, { mergePages: true });

  if (text.length <= MAX) return cleanup(text);

  const start = Math.floor(Math.random() * (text.length - MAX));

  return cleanup(text.slice(start, start + MAX));
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

export const getSystemPrompt = (course: string) => {
  return `You are a quiz generator.

Generate 20 to 25 MCQs from the provided text
which must be related to this course: ${course}.

Return ONLY valid JSON.

Each item must contain:
- title: string - The question itself
- options: string[] - Possible answers
- topics: string[] - Array of single relevant words
- answerIndex: number - Index of the answer in options
- explanation: string - Explanation of the answer

Rules:
- options must contain 3 choices
- answerIndex must match the correct option
- no markdown
- no extra commentary
`;
};
