import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SnippetSelectData } from "@/db/schema";
import { wrapCode } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { PinIcon } from "lucide-react";
import { formatSnippetKind } from "../lib/formatters";
import { SnippetActions } from "./snippet-actions";

export const SnippetCard = ({ snippet }: { snippet: SnippetSelectData }) => {
  const { label: kindLabel, icon: KindIcon } = formatSnippetKind(snippet.kind);
  const isCode = snippet.kind === "code";

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col gap-3 h-full">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {snippet.pinned && (
              <PinIcon
                className="size-5 text-muted-foreground fill fill-muted-foreground"
                aria-label="Pinned"
              />
            )}
            <h3 className="text-xl font-semibold truncate min-w-0">
              {snippet.name}
            </h3>
          </div>
          <SnippetActions snippet={snippet} />
        </div>
        <div className="flex items-center gap-2 flex-wrap text-base text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <KindIcon className="size-4" />
            {kindLabel}
          </span>
        </div>
        <div className="h-20 overflow-hidden p-4 rounded-xl bg-background/50">
          <div className="zoom-50">
            <MarkdownRenderer>
              {isCode ? wrapCode(snippet.body, snippet.language) : snippet.body}
            </MarkdownRenderer>
          </div>
        </div>
        {snippet.useCase && (
          <p className="text-base text-muted-foreground line-clamp">
            <span className="font-medium text-foreground/70">Use case:</span>{" "}
            {snippet.useCase}
          </p>
        )}
        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-auto pt-2 border-t border-border/50 text-base text-muted-foreground">
          Updated {formatDistanceToNow(snippet.updatedAt, { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );
};

export const SnippetCardSkeleton = () => (
  <Card className="h-full">
    <CardContent className="flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-7 flex-1" />
        <Skeleton className="size-7 shrink-0 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="h-4 w-3/5" />
      <div className="flex flex-wrap gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-auto pt-2 border-t border-border/50">
        <Skeleton className="h-3 w-28" />
      </div>
    </CardContent>
  </Card>
);
