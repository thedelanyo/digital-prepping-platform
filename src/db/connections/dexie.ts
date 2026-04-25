import { PUBLIC_DEXIE_DB_NAME } from "$env/static/public";
import Dexie from "dexie";

type Prep = { stage: number; selection: number };

export const prepletInit = {
  id: "",
  preps: [] as Prep[],
  score: { totalCorrect: 0, totalWrong: 0 },
};

type Preplet = typeof prepletInit;

const dexieDB = new Dexie(PUBLIC_DEXIE_DB_NAME);

dexieDB.version(1).stores({
  preplets: "id",
});

const table = dexieDB.table<Preplet, string>("preplets");

export const savePreplet = async (preplet: Preplet) => {
  try {
    await table.put(preplet);
  } catch (error: any) {
    console.error({ message: error.message });
  }
};

export const getPreplet = async (id: string) => {
  try {
    const record = await table.get(id);

    return record || { ...prepletInit, id };
  } catch (error: any) {
    console.error({ message: error.message });

    return { ...prepletInit, id };
  }
};
