"use server";

import { PartialSnippetSchema, SnippetSchema } from "@cue/shared/schemas";
import {
  createSnippet,
  deleteSnippet,
  getExistingSnippet,
  updateSnippet,
} from "../server/snippets";

export const getSnippetAction = async (id: string) => {
  return getExistingSnippet(id);
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
