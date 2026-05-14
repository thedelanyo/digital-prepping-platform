import { generateId } from "$lib/helpers/id.js";
import { generateWithGemini } from "$lib/server/ai/gemini";
import { pdfExtraction } from "$lib/server/ai/helpers.js";
import { fail } from "@sveltejs/kit";

export const actions = {
  generate: async ({ request }) => {
    const form = await request.formData();
    let state: "error" | "success" = "error";
    let message = "Successfully added preps";

    const id = generateId();

    const courseTitle = String(form.get("courseTitle"));
    const courseId = String(form.get("courseId"));
    const file = form.get("pdf");

    if (
      !file ||
      !(file instanceof File) ||
      file.size === 0 ||
      !file.type.includes("pdf")
    ) {
      message = "Please upload a valid pdf file.";
      return fail(400, { message, state });
    }

    if (!courseTitle || !courseId) {
      message = "Please select a course";
      return fail(400, { message, state });
    }

    try {
      const text = await pdfExtraction(file);

      if (!text.length) {
        message = "Cannot read the pdf file.";
        return fail(400, { message, state });
      }

      const questions = await generateWithGemini(text, courseTitle);

      const prep = { id, courseId, courseTitle, questions };

      state = "success";
      return { state, message, prep };
    } catch (e: any) {
      console.log(e.message);
      return { state, message: "Internal Error" };
    }
  },
};
