import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/preps.ts",
  dialect: "turso",
  dbCredentials: {
    // @ts-ignore
    url: process.env.TURSO_DATABASE_URL,
    // @ts-ignore
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
