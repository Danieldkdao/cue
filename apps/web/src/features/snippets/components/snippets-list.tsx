"use client";

import { ListError, ListLoader, Sentinel } from "@/components/list-components";
import { TextState } from "@/components/text-state";
import { SnippetSelectData } from "@/db/schema";
import { useInfiniteCursor } from "@/hooks/use-infinite-cursor";
import { SearchXIcon } from "lucide-react";
import { useCallback } from "react";
import { getSnippetsAction } from "../actions/actions";
import { useSnippetParams } from "../hooks/use-snippet-params";
import { SnippetCard } from "./snippet-card";

export const SnippetsList = ({
  initialSnippets,
  initialNextCursor,
}: {
  initialSnippets: SnippetSelectData[];
  initialNextCursor: string | null;
}) => {
  const [options] = useSnippetParams();
  const fetchSnippets = useCallback(
    async (lastCursor: string | null) => {
      return await getSnippetsAction({
        ...options,
        lastCursor,
      });
    },
    [options],
  );

  const {
    items: snippets,
    isPending,
    nextCursor,
    error,
    sentinelRef,
  } = useInfiniteCursor(initialSnippets, initialNextCursor, fetchSnippets, {
    customErrorMessage: "Failed to load snippets. Please try again.",
  });

  return (
    <div className="w-full flex flex-col gap-2">
      {snippets.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      ) : (
        <TextState
          childrenAbove={<SearchXIcon />}
          title="Snippets not found"
          description="We were unable to find any snippets that match the selected filters. Adjust your search terms and try again."
          classNames={{
            title: "text-xl",
          }}
        />
      )}
      <ListLoader loading={isPending} />
      <Sentinel ref={sentinelRef} show={!!nextCursor} />
      <ListError error={error} />
    </div>
  );
};
