import { db } from "@/db/db";
import { SnippetTable } from "@/db/schema";
import {
  partialSnippetSchema,
  PartialSnippetSchema,
  snippetSchema,
  SnippetSchema,
} from "@cue/shared/schemas";
import { isValidId } from "@cue/shared/utils";
import { eq } from "drizzle-orm";

export const getExistingSnippet = (id: string) => {
  if (!isValidId(id)) return null;

  return (
    db.select().from(SnippetTable).where(eq(SnippetTable.id, id)).get() ?? null
  );
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
