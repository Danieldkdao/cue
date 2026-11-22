import { serverEnv } from "@/data/env/server";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sqlite?: Database.Database };
const sqlite = globalForDb.sqlite ?? new Database(serverEnv.DATABASE_URL);
if (serverEnv.NODE_ENV !== "production") globalForDb.sqlite = sqlite;

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

sqlite.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS snippets_fts USING fts5(
    name, use_case, body, tags, content='snippets', content_rowid='rowid'
  );
`);

export const db = drizzle(sqlite, { schema });
