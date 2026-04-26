import { dev } from "$app/environment";
import { ONE_WEEK_IN_SECONDS } from "$lib/client/constants";
import type { Cookies } from "@sveltejs/kit";
import { decryptData, encryptData } from "./encryption";

type Options<T = any> = {
  name: string;
  age?: number;
  data: T;
  cookies: Cookies;
};

export const deleteCookie = (name: string, cookies: Cookies) => {
  cookies.set(name, "", {
    path: "/",
    maxAge: 0,
    secure: !dev,
  });
};

export const saveToCookie = (options: Options) => {
  const { name, cookies, data } = options;

  const date = new Date();
  const age = options.age || ONE_WEEK_IN_SECONDS;

  date.setSeconds(date.getSeconds() + age);

  cookies.set(name, encryptData(data), {
    path: "/",
    maxAge: age,
    expires: date,
    secure: !dev,
  });
};

type Op = Omit<Options, "age" | "data">;

export const getFromCookie = <T>(options: Op, fb: T) => {
  const data = options.cookies.get(options.name);

  if (!data) return fb;

  return decryptData<T>(data) || fb;
};
