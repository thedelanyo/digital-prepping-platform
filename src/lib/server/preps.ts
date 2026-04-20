import { tursoDB as db } from "$db/connections/turso";
import { prep_cards as table } from "$db/schema/preps";
import { and, eq, like, or, sql } from "drizzle-orm";

type Params = {
  course_id?: string;
  creator_id?: string;
  topic?: string;
};

const pageSize = 20;

export const getPreps = async (data?: Params) => {
  const selectors = {
    id: table.id,
    creator_name: table.creator_name,
    creator_id: table.creator_id,
    question: table.question,
  };

  const queries = or(
    eq(table.course_id, `${data?.course_id || ""}`),
    eq(table.creator_id, `${data?.creator_id || ""}`),
    eq(table.topic, `${data?.topic || ""}`),
  );

  try {
    const results = await db
      .select(selectors)
      .from(table)
      .where(and(like(table.id, `0:%`), queries))
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

    return results;
  } catch (e: any) {
    console.log({ message: e.message });

    return [];
  }
};
