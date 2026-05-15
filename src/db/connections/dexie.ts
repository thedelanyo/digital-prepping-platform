import { PUBLIC_DEXIE_DB_NAME } from "$env/static/public";
import Dexie from "dexie";

type Prep = { stage: number; selected: number; answer: number };

export const prepletInit = {
  id: "",
  preps: [] as Prep[],
  score: { totalCorrect: 0, totalWrong: 0 },
};

type Preplet = typeof prepletInit;

export type LocalPrep = {
  id: string;
  title: string;
  options: string[];
  answerIndex: number;
  courseId: string;
  courseTitle: string;
  topics: string;
  groupId: string;
};

const dexieDB = new Dexie(PUBLIC_DEXIE_DB_NAME);

dexieDB.version(1).stores({
  preplets: "id",
  preps: "id, courseId, groupId",
});

export const prepletTable = dexieDB.table<Preplet, string>("preplets");
export const localPrepTable = dexieDB.table<LocalPrep, string>("preps");

export const savePreplet = async (preplet: Preplet) => {
  try {
    await prepletTable.put(preplet);
  } catch (error: any) {
    console.error({ message: error.message });
  }
};

export const getPreplet = async (id: string) => {
  try {
    const record = await prepletTable.get(id);

    return record || { ...prepletInit, id };
  } catch (error: any) {
    console.error({ message: error.message });

    return { ...prepletInit, id };
  }
};
