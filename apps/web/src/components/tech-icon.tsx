import * as Original from "@devicons-pack/react/original";
import { CodeIcon } from "lucide-react";

type OriginalName = keyof typeof Original;
export const originalNames = Object.keys(Original) as OriginalName[];

export const TechIcon = ({
  name,
  size,
}: {
  name: OriginalName | string;
  size?: number;
}) => {
  const Icon = Original[name as OriginalName];
  if (!Icon) return <CodeIcon size={size} />;
  return <Icon width={size} height={size} title={name} />;
};