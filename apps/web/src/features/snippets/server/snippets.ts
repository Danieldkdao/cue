import { db } from "@/db/db";
import {
  createInArrayFilter,
  createSearchFilter,
  createSortByMap,
} from "@/db/helpers";
import { SnippetTable } from "@/db/schema";
import {
  partialSnippetSchema,
  PartialSnippetSchema,
  snippetSchema,
  SnippetSchema,
} from "@cue/shared/schemas";
import { isValidId } from "@cue/shared/utils";
import { and, eq } from "drizzle-orm";
import {
  snippetsCursorPaginationSchema,
  snippetsOptionsSchema,
  SnippetsOptionsSchema,
} from "../actions/schemas";
import { PAGE_SIZE } from "@/lib/constants";
import { normalizeData, writeCursor } from "@/lib/utils";
import { revalidateSnippetsCache } from "./cache/snippets";

export const getExistingSnippet = (id: string) => {
  if (!isValidId(id)) return null;

  return (
    db.select().from(SnippetTable).where(eq(SnippetTable.id, id)).get() ?? null
  );
};

export const getSnippets = (options: SnippetsOptionsSchema) => {
  const { data: optionsData, success: optionsSuccess } =
    snippetsOptionsSchema.safeParse(options);
  if (!optionsSuccess) return null;

  const { search, sortBy, kinds, lastCursor } = optionsData;

  const { data: cursorData, success: cursorSuccess } =
    snippetsCursorPaginationSchema.safeParse(lastCursor);
  if (!cursorSuccess) return null;

  const searchFilter = createSearchFilter(SnippetTable, search, [
    "name",
    "body",
    "technology",
    "useCase",
  ]);
  const kindFilter = createInArrayFilter(SnippetTable, kinds, "kind");
  const sortByMap = createSortByMap(SnippetTable, cursorData, [
    {
      option: "recently_created",
      order: "desc",
      property: "createdAt",
    },
    {
      option: "oldest",
      order: "asc",
      property: "createdAt",
    },
    {
      option: "recently_updated",
      order: "desc",
      property: "updatedAt",
    },
  ]);
  const sortByOption = sortByMap[sortBy];

  const filters = and(searchFilter, kindFilter, sortByOption.cursorFilter);

  const snippets = db
    .select()
    .from(SnippetTable)
    .where(filters)
    .orderBy(
      sortByOption.wrapper.sort(SnippetTable.pinned),
      ...sortByOption.sortBy,
    )
    .limit(PAGE_SIZE + 1)
    .all();
  const hasNextPage = snippets.length > PAGE_SIZE;

  const nextCursor = hasNextPage
    ? writeCursor({
        id: snippets[PAGE_SIZE - 1].id,
        marker: normalizeData(
          snippets[PAGE_SIZE - 1][sortByOption.nextCursorField],
        ),
      })
    : null;

  const snippetsKey = JSON.stringify({
    snippets: snippets.map((snippet) => ({
      id: snippet.id,
      updated: snippet.updatedAt.toISOString(),
    })),
    filters: {
      search,
      sortBy,
      kinds,
    },
  });

  return {
    data: snippets.slice(0, PAGE_SIZE),
    nextCursor,
    key: snippetsKey,
  };
};

export const createSnippet = (unsafeData: SnippetSchema) => {
  const { data, success } = snippetSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true as const,
      message: "Invalid data.",
      status: 400,
    };
  }

  try {
    const createdSnippet = db
      .insert(SnippetTable)
      .values({
        ...data,
        useCase: data.useCase ?? "",
      })
      .returning()
      .get();
    if (!createdSnippet) throw new Error("Failed to create snippet.");

    revalidateSnippetsCache();

    return {
      error: false as const,
      message: "Snippet created successfully!",
      data: createdSnippet,
    };
  } catch (error) {
    console.error(error);
    return {
      error: true as const,
      message: "Something went wrong. Please try again.",
      status: 500,
    };
  }
};

export const updateSnippet = (
  snippetId: string,
  unsafeData: PartialSnippetSchema,
) => {
  const { data, success } = partialSnippetSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true as const,
      message: "Invalid data.",
      status: 400,
    };
  }

  const existingSnippet = getExistingSnippet(snippetId);
  if (!existingSnippet) {
    return {
      error: true as const,
      message: "Snippet not found.",
      status: 404,
    };
  }

  try {
    const updatedSnippet = db
      .update(SnippetTable)
      .set({
        ...data,
        useCase: data.useCase ?? "",
      })
      .where(eq(SnippetTable.id, existingSnippet.id))
      .returning()
      .get();
    if (!updatedSnippet) throw new Error("Failed to update snippet.");

    revalidateSnippetsCache();

    return {
      error: false as const,
      message: "Snippet updated successfully!",
      data: updatedSnippet,
    };
  } catch (error) {
    console.error(error);
    return {
      error: true as const,
      message: "Something went wrong. Please try again.",
      status: 500,
    };
  }
};

export const deleteSnippet = (snippetId: string) => {
  const existingSnippet = getExistingSnippet(snippetId);
  if (!existingSnippet) {
    return {
      error: true as const,
      message: "Snippet not found.",
      status: 404,
    };
  }

  try {
    const deletedSnippet = db
      .delete(SnippetTable)
      .where(eq(SnippetTable.id, existingSnippet.id))
      .returning()
      .get();
    if (!deletedSnippet) throw new Error("Failed to delete snippet.");

    revalidateSnippetsCache();

    return {
      error: false as const,
      message: "Snippet deleted successfully!",
      data: deletedSnippet,
    };
  } catch (error) {
    console.error(error);
    return {
      error: true as const,
      message: "Something went wrong. Please try again.",
      status: 500,
    };
  }
};
