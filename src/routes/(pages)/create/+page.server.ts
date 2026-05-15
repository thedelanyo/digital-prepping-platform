import { tursoDB as db } from "$db/connections/turso.js";
import { prepTable as table } from "$db/schema/preps";
import type { Prep } from "$db/schema/preps.js";
import { generateId } from "$lib/helpers/id.js";
import { generateWithGemini } from "$lib/server/ai/gemini";
import { getCreator } from "$lib/server/creator";
import { downloadFile } from "$lib/server/file.js";
import { fail } from "@sveltejs/kit";

export const actions = {
  generate: async ({ request }) => {
    const form = await request.formData();
    let state: "error" | "success" = "error";
    let message = "Successfully generated";

    const courseTitle = String(form.get("courseTitle"));
    const courseId = String(form.get("courseId"));
    const textbookName = String(form.get("textbookName"));
    const textbookId = String(form.get("textbookId"));

    let file = form.get("pdf") as File;

    const fileCheck =
      !file ||
      !(file instanceof File) ||
      file.size === 0 ||
      !file.type.includes("pdf");

    if (!textbookId && fileCheck) {
      message = "Please upload a valid pdf file.";
      return fail(400, { message, state });
    }

    if (!courseTitle || !courseId) {
      message = "Please select a course";
      return fail(400, { message, state });
    }

    try {
      if (textbookId) {
        const downloadedFile = await downloadFile(textbookId, textbookName);

        if (downloadedFile === null) {
          message = `Error getting ${textbookName}`;
          return fail(400, { message, state });
        }

        file = downloadedFile;
      }

      const { questions, topics } = await generateWithGemini(file);
      const prep = {
        id: generateId(),
        courseId,
        courseTitle,
        questions,
        topics,
      };

      state = "success";
      return { state, message, prep };
    } catch (e: any) {
      console.log(e.message);
      return { state, message: "Internal Error" };
    }
  },

  publish: async ({ request, cookies }) => {
    const form = await request.formData();
    let state: "error" | "success" = "error";
    let message = "Successfully publish prep";

    const creator = getCreator(cookies);

    if (!creator.id) {
      message = "Add your name.";
      return fail(400, { message, state, toAddBio: true });
    }

    const prepStr = String(form.get("prep"));

    const prep = JSON.parse(prepStr) as Prep;

    const { courseId, courseTitle, topics, id } = prep;

    const preps = prep.questions.map(
      ({ title, options, answerIndex }, index) => {
        return {
          id: `${index}:${id}`,
          title,
          options,
          answerIndex,
          courseId: index === 0 ? courseId : "",
          courseTitle: index === 0 ? courseTitle : "",
          topics: index === 0 ? topics.join(",") : "",
          creatorId: index === 0 ? creator.id : "",
          creatorName: index === 0 ? creator.name : "",
        };
      },
    );

    if (preps.length < 10) {
      message = "At least 10 questions";
      return fail(400, { message, state });
    }

    if (preps.length > 20) {
      message = "At most 10 questions";
      return fail(400, { message, state });
    }

    try {
      await db.insert(table).values(preps);

      state = "success";

      return { state, message, publishId: id };
    } catch (e: any) {
      console.log(e.message);
      return { state, message: "Error publishing prep" };
    }
  },
};
