import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SnippetSelectData } from "@/db/schema";
import { wrapCode } from "@/lib/utils";
import { format } from "date-fns";
import { PinIcon } from "lucide-react";
import { ReactElement, ReactNode } from "react";
import { formatSnippetKind } from "../lib/formatters";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { CopyButton } from "@/components/copy-button";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <section className="flex min-w-0 flex-col gap-2">
      <h3 className="text-base font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
};

export const SnippetInfoDialog = ({
  snippet,
  children,
}: {
  snippet: SnippetSelectData;
  children: ReactElement;
}) => {
  const { label, icon: KindIcon } = formatSnippetKind(snippet.kind);
  const isCode = snippet.kind === "code";

  const markdown = (
    <MarkdownRenderer>
      {isCode ? wrapCode(snippet.body, snippet.language) : snippet.body}
    </MarkdownRenderer>
  );

  return (
    <Dialog>
      <DialogTrigger nativeButton={false} render={children} />
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle>{snippet.name}</DialogTitle>
            {snippet.pinned && (
              <Badge variant="secondary" className="gap-1">
                <PinIcon className="size-3" />
                Pinned
              </Badge>
            )}
          </div>
          <DialogDescription className="flex items-center gap-2">
            <KindIcon className="size-4" />
            <span>{label}</span>
            {isCode && snippet.language && (
              <Badge variant="outline">{snippet.language}</Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full min-w-0 flex flex-col gap-6">
          <Section title="Body">
            <CopyButton
              wrapper
              content={snippet.body}
              className="text-start cursor-pointer"
            >
              <TooltipWrapper content="Click to copy">
                {isCode ? (
                  markdown
                ) : (
                  <div className="p-4 rounded-xl bg-background/50">
                    {markdown}
                  </div>
                )}
              </TooltipWrapper>
            </CopyButton>
          </Section>
          <Section title="Use case">
            <p className="text-base text-muted-foreground">
              {snippet.useCase || "No use case provided."}
            </p>
          </Section>
          <Section title="Tags">
            {snippet.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-base text-muted-foreground">No tags.</p>
            )}
          </Section>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t pt-4 text-base min-w-0">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Created</span>
            <time dateTime={snippet.createdAt.toISOString()}>
              {format(snippet.createdAt, "PPp")}
            </time>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Updated</span>
            <time dateTime={snippet.updatedAt.toISOString()}>
              {format(snippet.updatedAt, "PPp")}
            </time>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
