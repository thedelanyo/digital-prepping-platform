import { tursoDB as db } from "$db/connections/turso";
import { prepTable as table } from "$db/schema/preps";
import { and, eq, like, or, sql } from "drizzle-orm";

const pageSize = 20;

export const getPreps = async (groupId: string, search = "") => {
  const selectors = {
    id: table.id,
    creatorName: table.creator_name,
    creatorId: table.creator_id,
    question: table.question,
    topics: table.topics,
    courseId: table.course_id,
  };

  const searches = or(
    like(sql`LOWER(${table.topics})`, `%${search.toLowerCase()}%`),
    like(sql`LOWER(${table.question})`, `%${search.toLowerCase()}%`),
    like(sql`LOWER(${table.options})`, `%${search.toLowerCase()}%`),
  );

  const queries = or(
    eq(table.course_id, groupId),
    eq(table.creator_id, groupId),
  );

  try {
    const results = await db
      .select(selectors)
      .from(table)
      .where(and(like(table.id, `0:%`), queries, search ? searches : undefined))
      .orderBy(sql`RANDOM()`)
      .limit(pageSize);

    return results;
  } catch (e: any) {
    console.log({ message: e.message });

    return [];
  }
};

export const getPrep = async (id: string) => {
  try {
    const results = await db
      .select()
      .from(table)
      .where(like(table.id, `%:${id}`));

    if (!results) return { preps: [], answers: [] };

    const answers = results.map((result) => result.answer_code);
    const preps = results.map(({ answer_code, ...rest }) => rest);

    return { preps, answers };
  } catch (e: any) {
    console.log({ message: e.message });

    return { preps: [], answers: [] };
  }
};
