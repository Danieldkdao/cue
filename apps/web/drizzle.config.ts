import { serverEnv } from "@/data/env/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: { url: serverEnv.DATABASE_URL ?? "./data/cue.db" },
});
