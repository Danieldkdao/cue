import { snippetKinds } from "@cue/shared";
import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const snippetsSortByOptions = [
  "recently_created",
  "oldest",
  "recently_updated",
] as const;
export type SnippetsSortByOption = (typeof snippetsSortByOptions)[number];

export const snippetsSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  sortBy: parseAsStringEnum([...snippetsSortByOptions])
    .withDefault("recently_created")
    .withOptions({ clearOnDefault: true }),
  kinds: parseAsArrayOf(parseAsStringEnum([...snippetKinds]))
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
};
export const loadSnippetsSearchParams = createLoader(snippetsSearchParams);
