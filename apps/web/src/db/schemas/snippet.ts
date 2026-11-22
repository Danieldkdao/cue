import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { snippetKinds } from "@cue/shared";

export const SnippetTable = sqliteTable("snippets", {
  id: text("id").primaryKey(),
  kind: text("kind", { enum: snippetKinds }).notNull(),
  name: text("name").notNull(),
  body: text("body").notNull(),
  language: text("language"),
  useCase: text("use_case").notNull().default(""),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
  pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type SnippetInsertData = typeof SnippetTable.$inferInsert;
export type SnippetSelectData = typeof SnippetTable.$inferSelect;
