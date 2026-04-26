import { generateId } from "$lib/helpers/id.js";
import { saveToCookie } from "$lib/server/cookies.js";
import { getCreator } from "$lib/server/creator.js";
import { fail } from "@sveltejs/kit";

export const load = async ({ cookies }) => {
  const creator = getCreator(cookies);
  return { creator };
};

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    let state: "error" | "success" = "error";
    let message = "Successfully added";

    const name = String(form.get("name"));

    if (!name) {
      message = "Add your name";
      return fail(400, { message, state });
    }

    try {
      const creator = { name, id: generateId() };
      saveToCookie({ name: "creator", data: creator, cookies });

      state = "success";

      return { state, message, creator };
    } catch (e: any) {
      console.log(e.message);
      return { state, message: "Internal Error" };
    }
  },
};
