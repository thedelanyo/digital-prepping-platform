import { shuffle } from "./arrays";

export const generateId = () => {
  const id = crypto.randomUUID().replaceAll("-", "");
  const now = `${Date.now()}`;

  const ids = shuffle([...now, ...id]);

  return ids.join("").slice(0, 20);
};
