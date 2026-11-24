import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const serverEnv = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().min(1).startsWith("./").default("./data/cue.db"),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
