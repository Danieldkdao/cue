import { cn } from "cn";
import { ReactNode } from "react";

export const TextState = ({
  title,
  description,
  classNames = {},
  error = false,
  children,
  childrenAbove,
}: {
  title: string;
  description: string;
  classNames?: {
    container?: string;
    title?: string;
    description?: string;
  };
  error?: boolean;
  children?: ReactNode;
  childrenAbove?: ReactNode;
}) => {
  const {
    container: containerClassName,
    title: titleClassName,
    description: descriptionClassName,
  } = classNames;

  return (
    <div className={cn("flex flex-col gap-2 items-center", containerClassName)}>
      {childrenAbove}
      <span
        className={cn(
          "text-base font-medium text-foreground text-center",
          error && "text-destructive",
          titleClassName,
        )}
      >
        {title}
      </span>
      <p
        className={cn(
          "text-base text-muted-foreground text-center",
          error && "text-destructive",
          descriptionClassName,
        )}
      >
        {description}
      </p>
      {children}
    </div>
  );
};
