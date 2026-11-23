import {
  snippetsCursorPaginationSchema,
  snippetsOptionsSchema,
} from "@/features/snippets/actions/schemas";
import {
  createSnippet,
  getSnippets,
} from "@/features/snippets/server/snippets";
import { snippetSchema } from "@cue/shared/schemas";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const kinds = searchParams.getAll("kinds");

  const rawOptions = {
    ...Object.fromEntries(searchParams.entries()),
    ...(kinds.length ? { kinds } : {}),
  };

  const { data, success } = snippetsOptionsSchema.safeParse(rawOptions);
  if (!success) {
    return NextResponse.json(
      { error: true, message: "Invalid data." },
      { status: 400 },
    );
  }

  const cursorResult = snippetsCursorPaginationSchema.safeParse(
    data.lastCursor,
  );
  if (!cursorResult.success) {
    return NextResponse.json(
      { error: true, message: "Invalid cursor data." },
      { status: 400 },
    );
  }

  const snippets = getSnippets(data);
  if (!snippets) {
    return NextResponse.json(
      { error: true, message: "Invalid data." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Data fetched successfully!",
    data: snippets,
  });
};

export const POST = async (request: NextRequest) => {
  try {
    const json = await request.json();

    const { data, success } = snippetSchema.safeParse(json);
    if (!success) {
      return NextResponse.json(
        { error: true, message: "Invalid data." },
        { status: 400 },
      );
    }

    const res = createSnippet(data);

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
