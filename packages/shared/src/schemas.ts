import z from "zod";
import { snippetKinds } from "./index.ts";

export const snippetSchema = z.object({
  kind: z.enum(snippetKinds),
  name: z.string().trim().min(1),
  body: z.string().trim().min(1),
  language: z.string().nullish(),
  useCase: z.string().trim().nullish().default(""),
  tags: z.array(z.string()),
  pinned: z.boolean(),
});
export type SnippetSchema = z.infer<typeof snippetSchema>;

export const partialSnippetSchema = snippetSchema.partial();
export type PartialSnippetSchema = z.infer<typeof partialSnippetSchema>;
