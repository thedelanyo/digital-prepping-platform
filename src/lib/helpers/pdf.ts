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
