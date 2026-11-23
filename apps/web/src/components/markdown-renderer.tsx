import { cn } from "cn";
import "highlight.js/styles/github-dark.css";
import { ComponentProps } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const components: Components = {
  pre: ({ node: _node, className, ...props }) => (
    <pre
      className={cn("overflow-x-auto rounded-xl p-4 min-w-0", className)}
      {...props}
    />
  ),
};

export const MarkdownRenderer = ({
  children,
  className,
  ...props
}: { children: string; className?: string } & Omit<
  ComponentProps<typeof Markdown>,
  "remarkPlugins" | "rehypePlugins" | "components"
>) => {
  return (
    <div
      className={cn(
        "prose prose-base dark:prose-invert max-w-none min-w-0 overflow-x-hidden overflow-y-auto scrollbar-none max-h-80",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
        {...props}
      >
        {children}
      </Markdown>
    </div>
  );
};
