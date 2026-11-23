import { create } from "zustand";

type VersionStore = {
  versions: Record<string, number>;
  bump: (key: string) => void;
};

export const useVersionStore = create<VersionStore>((set) => ({
  versions: {},
  bump: (key) =>
    set((s) => ({
      versions: { ...s.versions, [key]: (s.versions[key] ?? 0) + 1 },
    })),
}));

export const useVersion = (key: string) =>
  useVersionStore((s) => s.versions[key] ?? 0);
