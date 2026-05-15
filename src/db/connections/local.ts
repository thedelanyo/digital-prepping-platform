import type { Prep } from "$db/schema/preps";
import { localPrepTable } from "./dexie";

export const saveLocalPrep = async (prep: Prep) => {
  const preps = prep.questions.map((question, index) => {
    const { title, options, answerIndex } = question;
    const { topics, courseId, courseTitle, id } = prep;

    return {
      id: `${index}:${id}`,
      title,
      options,
      answerIndex,
      courseId: index === 0 ? courseId : "",
      courseTitle: index === 0 ? courseTitle : "",
      topics: index === 0 ? topics.join(",") : "",
      groupId: id,
    };
  });

  try {
    await localPrepTable.bulkPut(preps);
  } catch (error: any) {
    console.error({ message: error.message });
  }
};
