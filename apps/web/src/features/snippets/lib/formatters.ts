import { SnippetKind } from "@cue/shared";
import { CodeIcon, MessageSquareIcon } from "lucide-react";
import { SnippetsSortByOption } from "./params";

export const formatSnippetKind = (kind: SnippetKind) => {
  switch (kind) {
    case "code":
      return {
        label: "Code",
        icon: CodeIcon,
      };
    case "prompt":
      return {
        label: "Prompt",
        icon: MessageSquareIcon,
      };
    default:
      throw new Error(`Unknown snippet kind: ${kind satisfies never}`);
  }
};

export const formatSnippetSortByOption = (option: SnippetsSortByOption) => {
  switch (option) {
    case "oldest":
      return "Oldest";
    case "recently_created":
      return "Recently created";
    case "recently_updated":
      return "Recently updated";
    default:
      throw new Error(
        `Unknown snippet sort by option: ${option satisfies never}`,
      );
  }
};
