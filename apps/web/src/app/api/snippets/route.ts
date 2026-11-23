import { snippetsOptionsSchema } from "@/features/snippets/actions/schemas";
import {
  createSnippet,
  getSnippets,
} from "@/features/snippets/server/snippets";
import { snippetSchema } from "@cue/shared/schemas";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const json = await request.json();
  const { data, success } = snippetsOptionsSchema.safeParse(json);

  if (!success) {
    return NextResponse.json(
      { error: true, message: "Invalid data." },
      { status: 400 },
    );
  }

  const snippets = getSnippets(data);
  if (!snippets) {
    return NextResponse.json(
      { error: true, message: "Failed to fetch data." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Data fetched successfully!",
    data: snippets,
  });
};

export const POST = async (request: Request) => {
  const json = await request.json();

  const { data, success } = snippetSchema.safeParse(json);
  if (!success) {
    return NextResponse.json(
      { error: false, message: "Invalid data." },
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
};
