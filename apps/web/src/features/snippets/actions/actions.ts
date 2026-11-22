"use server";

import { PartialSnippetSchema, SnippetSchema } from "@cue/shared/schemas";
import {
  createSnippet,
  deleteSnippet,
  getExistingSnippet,
  getSnippets,
  updateSnippet,
} from "../server/snippets";
import { SnippetsOptionsSchema } from "./schemas";
import { cacheTag } from "next/cache";
import {
  getSnippetsGlobalTag,
  revalidateSnippetsCache,
} from "../server/cache/snippets";

export const getSnippetAction = async (id: string) => {
  return getExistingSnippet(id);
};

export const getSnippetsAction = async (options: SnippetsOptionsSchema) => {
  "use cache";
  cacheTag(getSnippetsGlobalTag());

  return getSnippets(options);
};

export const createSnippetAction = async (unsafeData: SnippetSchema) => {
  return createSnippet(unsafeData);
};

export const updateSnippetAction = async (
  id: string,
  unsafeData: PartialSnippetSchema,
) => {
  return updateSnippet(id, unsafeData);
};

export const deleteSnippetAction = async (id: string) => {
  return deleteSnippet(id);
};
