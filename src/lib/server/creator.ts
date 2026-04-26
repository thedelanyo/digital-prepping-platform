import type { Cookies } from "@sveltejs/kit";
import { getFromCookie } from "./cookies";

export const getCreator = (cookies: Cookies) => {
  return getFromCookie({ cookies, name: "creator" }, { name: "", id: "" });
};
