import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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

export const prepsInit: PrepCards = {
  id: "",
  course_id: "",
  course_title: "",
  question: "",
  options: [],
  answer_code: 0,
  creator_name: "",
  creator_id: "",
  topic: "",
};
