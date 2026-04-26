import { getCourseTitle } from "$lib/helpers/topic.js";
import { getPreps } from "$lib/server/preps.js";
import { error } from "@sveltejs/kit";

export const load = async ({ url }) => {
  let courseId = url.searchParams.get("course");
  let creatorId = url.searchParams.get("creator");
  let search = url.searchParams.get("search");

  let groupId = courseId || creatorId;
  let message = "Sorry, we couldn't find the resource you are looking for";

  if (!groupId) {
    error(404, message);
  }

  const preps = await getPreps(groupId, search || "");

  if (preps.length === 0) {
    error(404, message);
  }

  const title = search || getCourseTitle(groupId) || preps[0].creatorName;

  const meta = { title, image: `/courses/${courseId}.webp` };

  return { title, preps, meta };
};
