import { getFromCookie, saveToCookie } from "$lib/server/cookies.js";
import { getPrep } from "$lib/server/preps.js";
import { fail } from "@sveltejs/kit";

export const load = async ({ params, cookies }) => {
  const { id } = params;
  const { preps, answers } = await getPrep(id);

  saveToCookie({ cookies, name: "answers", data: answers });

  const stageStr = getFromCookie({ cookies, name: "stage" }, `1:${id}`);
  const [stageNum, prepId] = stageStr.split(":");

  const stage = prepId === id ? parseInt(stageNum, 10) : 1;

  return { preps, id, stage };
};

export const actions = {
  getAnswer: async ({ request, cookies }) => {
    const form = await request.formData();
    let state: "error" | "success" = "error";
    let answered = String(form.get("answered")) as "YES" | "NO";

    if (answered === "YES") {
      const message = "Already answered.";
      return fail(400, { message, state });
    }

    let stage = Number(form.get("stage"));

    const answers = getFromCookie({ cookies, name: "answers" }, []) as number[];

    const answer = answers[stage - 1];

    return { state, answer };
  },

  stepper: async ({ request, cookies }) => {
    const form = await request.formData();
    let state: "error" | "success" = "error";
    let message = "";

    let stage = Number(form.get("stage"));
    let length = Number(form.get("length"));
    let direction = String(form.get("direction")) as "R" | "L";
    let answered = String(form.get("answered")) as "YES" | "NO";
    let id = String(form.get("id"));

    if (answered === "NO" && direction === "R") {
      message = "Question not answered.";
      return fail(400, { message, state });
    }

    stage = direction === "L" && stage !== 1 ? stage - 1 : stage;
    stage = direction === "R" && stage !== length ? stage + 1 : stage;

    saveToCookie({ cookies, name: "stage", data: `${stage}:${id}` });

    return { state, message, stage, direction: "L" };
  },
};
