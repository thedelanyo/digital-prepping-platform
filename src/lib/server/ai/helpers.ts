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

Create ${max} multiple-choice questions from the provided PDF or text.

Return ONLY valid JSON.

Each item must include:
- title: string - The question
- options: string[] - Possible answers
- answerIndex: number - Index of the correct answer in options
- explanation: string - Explanation of the answer

Include a topics array of relevant single-word terms:
- topics: string[]

Rules:
- Provide 3 or 4 options per question.
- Randomize the correct answer positions.
- topics must be an array of single relevant words.
- answerIndex must match the correct option.
- No markdown.
- No extra commentary.
- Analyze the provided PDF or text content and choose questions
  based on important areas across different pages.
`;

  return prompt;
};
