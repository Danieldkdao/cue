import { useEffect, useMemo, useRef, useState, useTransition } from "react";

type CursorPage<T> = { data: T[]; nextCursor: string | null };

export const useInfiniteCursor = <T>(
  initialItems: T[],
  initialNextCursor: string | null,
  fetchAction: (lastCursor: string | null) => Promise<CursorPage<T> | null>,
  options: {
    rootMargin?: string;
    customErrorMessage?: string;
    enabled?: boolean;
  } = {},
) => {
  const { rootMargin, customErrorMessage, enabled = true } = options;

  const loadingRef = useRef(false);

  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
  const [extraPages, setExtraPages] = useState<T[][]>([]);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => [...initialItems, ...extraPages.flat()],
    [initialItems, extraPages],
  );

  useEffect(() => {
    if (!sentinelEl || isPending || !nextCursor || !enabled || error) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadingRef.current) return;

        loadingRef.current = true;

        startTransition(async () => {
          try {
            setError(null);

            const response = await fetchAction(nextCursor);
            if (!response) throw new Error("Failed to load more items.");

            const { nextCursor: resNextCursor, data } = response;
            setExtraPages((prev) => [...prev, data]);
            setNextCursor(resNextCursor);
          } catch (error) {
            setError(
              customErrorMessage ||
                "Failed to load more items. Please try again.",
            );
          } finally {
            loadingRef.current = false;
          }
        });
      },
      {
        rootMargin: rootMargin || "400px",
        root: containerEl,
      },
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [
    containerEl,
    customErrorMessage,
    fetchAction,
    isPending,
    nextCursor,
    rootMargin,
    sentinelEl,
    enabled,
    error,
  ]);

  return {
    containerRef: setContainerEl,
    sentinelRef: setSentinelEl,
    items,
    nextCursor,
    isPending,
    error,
  };
};
