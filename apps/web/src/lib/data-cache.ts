type CacheTag = "snippets";

export const getGlobalTag = (tag: CacheTag) => {
  return `global:${tag}` as const;
};
