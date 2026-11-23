import {
  deleteSnippet,
  getExistingSnippet,
  updateSnippet,
} from "@/features/snippets/server/snippets";
import { partialSnippetSchema } from "@cue/shared/schemas";
import { isValidId } from "@cue/shared/utils";
import { NextResponse } from "next/server";

type ParamsId = { params: Promise<{ id: string }> };

export const GET = async (_: Request, { params }: ParamsId) => {
  const id = (await params).id;
  if (!isValidId(id)) {
    return NextResponse.json(
      { error: true, message: "Snippet not found." },
      { status: 404 },
    );
  }

  const existingSnippet = getExistingSnippet(id);
  if (!existingSnippet) {
    return NextResponse.json(
      { error: true, message: "Failed to find snippet." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Data fetched successfully!",
    data: existingSnippet,
  });
};

export const PUT = async (request: Request, { params }: ParamsId) => {
  const id = (await params).id;
  if (!isValidId(id)) {
    return NextResponse.json(
      { error: true, message: "Snippet not found." },
      { status: 404 },
    );
  }

  const json = await request.json();

  const { data, success } = partialSnippetSchema.safeParse(json);
  if (!success) {
    return NextResponse.json(
      { error: true, message: "Invalid data." },
      { status: 400 },
    );
  }

  const res = updateSnippet(id, data);

  return NextResponse.json(
    {
      error: res.error,
      message: res.message,
      data: res.data,
    },
    { status: res.status },
  );
};

export const DELETE = async (request: Request, { params }: ParamsId) => {
  const id = (await params).id;
  if (!isValidId(id)) {
    return NextResponse.json(
      { error: true, message: "Snippet not found." },
      { status: 404 },
    );
  }

  const res = deleteSnippet(id);

  return NextResponse.json(
    { error: res.error, message: res.message, data: res.data },
    { status: res.status },
  );
};
