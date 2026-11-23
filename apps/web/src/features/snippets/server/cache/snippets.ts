import { getGlobalTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getSnippetsGlobalTag = () => {
  return getGlobalTag("snippets");
};

export const revalidateSnippetsCache = () => {
  revalidateTag(getSnippetsGlobalTag(), { expire: 0 });
};
