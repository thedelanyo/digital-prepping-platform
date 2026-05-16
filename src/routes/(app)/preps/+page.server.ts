import { getCourseTitle } from "$lib/client/topic";
import { getCreator } from "$lib/server/creator.js";
import { getOwnerPreps, getPreps } from "$lib/server/preps.js";
import { error } from "@sveltejs/kit";

export const load = async ({ url, cookies }) => {
  let courseId = url.searchParams.get("course");
  let author = url.searchParams.get("author") || "";
  let search = url.searchParams.get("search") || "";
  let tab = url.searchParams.get("tab") as "others" | "you";

  let title = "";
  const creatorId = getCreator(cookies).id;
  tab = tab || "others";

  if (!courseId) {
    error(404, "Sorry, we couldn't find the resource you are looking for");
  }

  const courseTitle = getCourseTitle(courseId);

  if (tab === "you") {
    const preps = await getOwnerPreps(creatorId, courseId);
    title = `Your preps in ${courseTitle}`;

    return { preps, title, tab };
  }

  const preps = await getPreps({ courseId, creatorId, search, author });

  title = search || courseTitle || title;
  title = author ? preps[0]?.creatorName : title;

  let meta = { title, image: `/courses/${courseId}.webp` };

  return { title, preps, meta, tab };
};
