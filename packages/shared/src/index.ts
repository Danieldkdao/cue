export const snippetKinds = ["prompt", "code"] as const;
export type SnippetKind = (typeof snippetKinds)[number];
