import { tursoDB as db } from "$db/connections/turso.js";
import type { Prep } from "$db/schema/preps";
import { prepTable as table } from "$db/schema/preps";
import { generateId } from "$lib/helpers/id.js";
import { trimSpaces } from "$lib/helpers/text.js";
import { getCreator } from "$lib/server/creator.js";
import { fail } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    let state: "error" | "success" = "error";
    let message = "Successfully added preps";

    const id = generateId();

    const creator = getCreator(cookies);

    if (!creator.id) {
      message = "Visit profile page to save your name.";
      return fail(400, { message, state });
    }

    const prepStr = String(form.get("prep"));

    const prep = JSON.parse(prepStr) as Prep;

    const { course_id, course_title } = prep;
    const topics = prep.topics.slice(0, 3);

    if (!course_title || !course_id) {
      message = "Course is required";
      return fail(400, { message, state });
    }

    if (!topics.length) {
      message = "At least one topic is required";
      return fail(400, { message, state });
    }

    const preps = prep.questions
      .map(({ title, options, answer_code }, index) => {
        options = options.map((opt) => trimSpaces(opt)).filter((opt) => opt);

        const is_first = index === 0;

        return {
          id: `${index}:${id}`,
          question: trimSpaces(title),
          options,
          answer_code,
          course_id: is_first ? course_id : "",
          course_title: is_first ? course_title : "",
          topics: is_first ? topics.join(",") : "",
          creator_id: is_first ? creator.id : "",
          creator_name: is_first ? creator.name : "",
        };
      })
      .filter(({ question }) => question);

    if (preps.length < 10) {
      message = "At least 10 questions";
      return fail(400, { message, state });
    }

    if (preps.length > 20) {
      message = "At most 10 questions";
      return fail(400, { message, state });
    }

    for (const { question, answer_code, options } of preps) {
      if (question.length > 200) {
        message = "A question cannot be longer 100 chars";
        return fail(400, { message, state });
      }

      if (options.length < 2) {
        message = "A question must have at least 2 possible answers";
        return fail(400, { message, state });
      }

      if (!options[answer_code]) {
        message = "A question must have a valid answer";
        return fail(400, { message, state });
      }
    }

    try {
      await db.insert(table).values(preps);

      state = "success";

      return { state, message, id };
    } catch (e: any) {
      console.log(e.message);
      return { state, message: "Internal Error" };
    }
  },
};
