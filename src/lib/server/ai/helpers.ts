export const cleanJson = (text: string) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const transformTopics = (topics: string[]) => {
  return topics
    .map((topic) => {
      return topic.split(" ")[0];
    })
    .slice(0, 3);
};

export const systemInstruction = `You are a quiz generator.

Generate 20 to 25 MCQs from the provided pdf or text.

Return ONLY valid JSON.

Each item must contain:
- title: string - The question itself
- options: string[] - Possible answers
- answerIndex: number - Index of the answer in options
- explanation: string - Explanation of the answer

With a topics array of single relevant words which was covered
- topics: string[]

Rules:
- options must contain 3 choices
- topics must be an array of single relevant words
- answerIndex must match the correct option
- no markdown
- no extra commentary
`;
