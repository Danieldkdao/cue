import z from "zod";
import { snippetKinds } from "./index.ts";

export const snippetSchema = z.object({
  kind: z.enum(snippetKinds),
  name: z.string().trim().min(1, { error: "Please enter a name." }),
  body: z.string().trim().min(1, { error: "Please enter a snippet/prompt." }),
  technology: z.string().nullish(),
  useCase: z.string().trim().nullish(),
  tags: z.array(z.string()),
  pinned: z.boolean(),
});
export type SnippetSchema = z.infer<typeof snippetSchema>;

export const partialSnippetSchema = snippetSchema.partial();
export type PartialSnippetSchema = z.infer<typeof partialSnippetSchema>;
