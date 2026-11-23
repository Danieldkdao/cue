"use client";

import { ComponentProps } from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/toast";

export const CopyButton = ({
  className,
  content,
  wrapper = false,
  children,
  ...props
}: {
  className?: string;
  content: string;
  wrapper?: boolean;
} & Omit<ComponentProps<typeof Button>, "className" | "onClick">) => {
  const copy = async () => {
    await window.navigator.clipboard.writeText(content);
    toast.add({ type: "success", title: "Snippet copied to clipboard!" });
  };

  if (wrapper) {
    return (
      <button onClick={copy} className={className}>
        {children}
      </button>
    );
  }

  return (
    <Button {...props} onClick={copy}>
      {children}
    </Button>
  );
};
