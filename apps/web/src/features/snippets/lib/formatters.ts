import { SnippetKind } from "@cue/shared";
import { CodeIcon, MessageSquareIcon } from "lucide-react";

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
