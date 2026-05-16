import { tursoDB as db } from "$db/connections/turso";
import { prepTable as table } from "$db/schema/preps";
import { and, eq, like, ne, or, sql } from "drizzle-orm";

const pageSize = 20;

type Options = {
  courseId: string;
  creatorId: string;
  search: string;
  author: string;
};

const getSelectors = () => {
  const { id, creatorId, creatorName, title, topics, courseId } = table;

  return { id, creatorName, creatorId, title, topics, courseId };
};

export const getOwnerPreps = async (creatorId: string, courseId: string) => {
  const selectors = getSelectors();

  if (!creatorId) return [];

  const queries = and(
    like(table.id, `0:%`),
    eq(table.courseId, courseId),
    eq(table.creatorId, creatorId),
  );

  try {
    const results = await db
      .select(selectors)
      .from(table)
      .where(queries)
      .orderBy(sql`RANDOM()`)
      .limit(pageSize);

    return results;
  } catch (e: any) {
    console.log({ message: e.message });

    return [];
  }
};

export const getPreps = async (options: Options) => {
  const selectors = getSelectors();

  const { courseId, search, creatorId, author } = options;

  const searches = or(
    like(sql`LOWER(${table.topics})`, `%${search.toLowerCase()}%`),
    like(sql`LOWER(${table.title})`, `%${search.toLowerCase()}%`),
    like(sql`LOWER(${table.options})`, `%${search.toLowerCase()}%`),
  );

  const authorQuery = author ? eq(table.creatorId, author) : undefined;
  const creatorQuery = creatorId ? ne(table.creatorId, creatorId) : undefined;
  const searchQuery = search ? searches : undefined;
  const idQuery = like(table.id, `0:%`);
  const courseQuery = eq(table.courseId, courseId);

  try {
    const results = await db
      .select(selectors)
      .from(table)
      .where(and(idQuery, courseQuery, authorQuery, creatorQuery, searchQuery))
      .orderBy(sql`RANDOM()`)
      .limit(pageSize);

    return results;
  } catch (e: any) {
    console.log({ message: e.message });

    return [];
  }
};

export const getPrep = async (groupId: string) => {
  try {
    const { id, title, options, answerIndex } = table;
    const selectors = { id, title, options, answerIndex };

    const results = await db
      .select(selectors)
      .from(table)
      .where(like(table.id, `%:${groupId}`));

    if (!results) return { preps: [], answers: [] };

    const answers = results.map((result) => result.answerIndex);
    const preps = results.map(({ answerIndex, ...rest }) => rest);

    return { preps, answers };
  } catch (e: any) {
    console.log({ message: e.message });

    return { preps: [], answers: [] };
  }
};
