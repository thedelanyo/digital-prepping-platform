import { randomItem } from "$lib/helpers/arrays";

export const cleanJson = (text: string) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const transformTopics = (topics: string[]) => {
  return topics.map((topic) => topic.split(" ")[0]).slice(0, 3);
};

export const getSysPrompt = () => {
  const max = randomItem([20, 25, 23, 22, 18, 15, 19, 30, 21, 16, 17, 10]);

  const prompt = `You are a quiz generator.

Generate ${max} MCQs from the provided pdf or text.

Return ONLY valid JSON.

Each item must contain:
- title: string - The question itself
- options: string[] - Possible answers
- answerIndex: number - Index of the answer in options
- explanation: string - Explanation of the answer

With a topics array of single relevant words which was covered
- topics: string[]

Rules:
- options can contain between 3 to 4 choices.
- Randomize the correct answers to make it hard to predict.
- topics must be an array of single relevant words.
- answerIndex must match the correct option.
- no markdown.
- no extra commentary.
`;

  return prompt;
};
