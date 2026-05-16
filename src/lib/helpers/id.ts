import { shuffle } from "./arrays";

export const generateId = () => {
  const id = crypto.randomUUID().replaceAll("-", "");
  const now = `${Date.now()}`;

  const ids = shuffle([...now, ...id]);

  return ids.join("").slice(0, 25);
};

export const hashString = async (input: string) => {
  const data = new TextEncoder().encode(input);

  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 30);
};
