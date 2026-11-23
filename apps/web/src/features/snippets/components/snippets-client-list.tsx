"use client";

import { SnippetSelectData } from "@/db/schema";
import { useVersion } from "@/store/use-version-store";
import { SnippetsList } from "./snippets-list";

export const SnippetsClientList = ({
  serverKey,
  ...props
}: {
  initialSnippets: SnippetSelectData[];
  initialNextCursor: string | null;
  serverKey: string;
}) => {
  const version = useVersion("snippets");

  const newKey = `${serverKey}-version-${version}`;

  return <SnippetsList {...props} key={newKey} />;
};
