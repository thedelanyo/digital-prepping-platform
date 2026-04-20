import { getPrep } from "$lib/server/preps.js";

export const load = async ({ params }) => {
  const preps = await getPrep(params.id);

  return { preps };
};
