import { z } from "zod";

export const aiPrepSchema = z.object({
  questions: z.array(
    z.object({
      title: z.string().trim().describe("The question itself."),
      options: z.array(z.string()).min(2).max(3).describe("Possible answers"),
      answerIndex: z.number().int().nonnegative().min(0).max(2),
      explanation: z.string().trim().describe("Explanation of the answer."),
    }),
  ),
});
