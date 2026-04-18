import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { writable } from "svelte/store";

export const prep_cards = sqliteTable("prep_cards", {
  id: text("id", "").primaryKey(),
  course_id: text("course_id").default("").notNull(),
  course_title: text("course_title").default("").notNull(),
  question: text("question").default("").notNull(),
  options: text("options", { mode: "json" }).$type<string[]>().notNull(),
  answer_code: integer("answer_code").default(0).notNull(),
  creator_name: text("creator_name").default("").notNull(),
  creator_id: text("creator_id").default("").notNull(),
  topic: text("topic").default("").notNull(),
});

export type PrepCards = typeof prep_cards.$inferSelect;

type Question = {
  title: string;
  options: string[];
  answer_code: number;
};

export const prepInit = {
  id: "",
  course_id: "",
  course_title: "",
  creator_name: "",
  creator_id: "",
  topic: "",
  questions: [] as Question[],
};

export const prep = writable(prepInit);
