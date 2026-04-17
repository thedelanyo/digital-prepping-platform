import {
  TURSO_AUTH_TOKEN as authToken,
  TURSO_DATABASE_URL as url,
} from "$env/static/private";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const tursoDB = drizzle(createClient({ url, authToken }));
