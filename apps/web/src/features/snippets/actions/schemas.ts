import {
  createCursorPaginationSchema,
  isoTimestampSchema,
} from "@/lib/schemas";
import z from "zod";
import { snippetsSortByOptions } from "../lib/params";
import { snippetKinds } from "@cue/shared";

export const snippetsCursorPaginationSchema = createCursorPaginationSchema(
  z.object({
    id: z.uuid(),
    marker: z.union([isoTimestampSchema]),
    pinned: z.literal([0, 1]),
  }),
);

export const snippetsOptionsSchema = z.object({
  search: z.string().trim().default(""),
  sortBy: z.enum(snippetsSortByOptions).default("recently_created"),
  kinds: z.array(z.enum(snippetKinds)).default([]),
  lastCursor: z.base64url().nullable().default(null).optional(),
});
export type SnippetsOptionsSchema = z.infer<typeof snippetsOptionsSchema>;
