import { prepletInit } from "$db/connections/dexie";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { writable } from "svelte/store";
import { z } from "zod";

const questionSchema = z.object({
  title: z.string().trim(),
  options: z.array(z.string()).min(2).max(3),
  topics: z.array(z.string()).min(1).max(3),
  answerIndex: z.number().int().nonnegative().min(0).max(2),
  explanation: z.string().trim(),
});

export const aiPrepSchema = z.object({
  questions: z.array(questionSchema),
});

type Question = z.infer<typeof questionSchema>;

export const prepTable = sqliteTable("preps", {
  id: text("id", "").primaryKey(),
  courseId: text("course_id").default("").notNull(),
  courseTitle: text("course_title").default("").notNull(),
  title: text("title").default("").notNull(),
  options: text("options", { mode: "json" }).$type<string[]>().notNull(),
  answerIndex: integer("answer_index").default(0).notNull(),
  topics: text("topics").default("").notNull(),
  creatorName: text("creator_name").default("").notNull(),
  creatorId: text("creator_id").default("").notNull(),
});

export const prepInit = {
  id: "",
  courseId: "",
  courseTitle: "",
  questions: [] as Question[],
};

export type Prep = typeof prepInit;

export const prep = writable(prepInit);
export const preplet = writable(prepletInit);
