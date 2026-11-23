import {
  deleteSnippet,
  getExistingSnippet,
  updateSnippet,
} from "@/features/snippets/server/snippets";
import { partialSnippetSchema } from "@cue/shared/schemas";
import { isValidId } from "@cue/shared/utils";
import { NextRequest, NextResponse } from "next/server";

type ParamsId = { params: Promise<{ id: string }> };

export const GET = async (_: NextRequest, { params }: ParamsId) => {
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
      { error: true, message: "Snippet not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Data fetched successfully!",
    data: existingSnippet,
  });
};

export const PUT = async (request: NextRequest, { params }: ParamsId) => {
  try {
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: "Unexpected error." },
      { status: 500 },
    );
  }
};

export const DELETE = async (_: NextRequest, { params }: ParamsId) => {
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
