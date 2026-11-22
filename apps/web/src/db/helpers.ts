import { sql } from "drizzle-orm";
import { SnippetSelectData } from "./schema";
import { db } from "./db";

export const indexSnippet = (s: SnippetSelectData) => {
  db.run(
    sql`DELETE FROM snippets_fts WHERE rowid = (SELECT rowid FROM snippets WHERE id = ${s.id})`,
  );
  db.run(sql`INSERT INTO snippets_fts(rowid, name, use_case, body, tags)
    SELECT rowid, name, use_case, body, tags FROM snippets WHERE id = ${s.id}`);
};
