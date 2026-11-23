import "highlight.js/styles/github-dark.css";
import { ComponentProps } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export const MarkdownRenderer = ({
  children,
  ...props
}: { children: string } & Omit<
  ComponentProps<typeof Markdown>,
  "remarkPlugins" | "rehypePlugins"
>) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      {...props}
    >
      {children}
    </Markdown>
  );
};
