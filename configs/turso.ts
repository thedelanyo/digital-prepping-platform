import { defineConfig } from "drizzle-kit";

const TURSO_AUTH_TOKEN = ``;
const TURSO_DATABASE_URL = ``;

export default defineConfig({
  schema: "./src/db/schema/preps.ts",
  dialect: "turso",
  // dbCredentials: {
  //   url: process.env.DATABASE_URL,
  //   authToken: process.env.DATABASE_AUTH_TOKEN,
  // },
  dbCredentials: { url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN },
});
