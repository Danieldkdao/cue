import { TextState } from "@/components/text-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getSnippetsAction } from "@/features/snippets/actions/actions";
import { SnippetCardSkeleton } from "@/features/snippets/components/snippet-card";
import { SnippetsClientList } from "@/features/snippets/components/snippets-client-list";
import { SnippetsFilter } from "@/features/snippets/components/snippets-filters";
import { SnippetsList } from "@/features/snippets/components/snippets-list";
import { loadSnippetsSearchParams } from "@/features/snippets/lib/params";
import { SearchParamsProps } from "@/lib/types";
import { Suspense } from "react";

const Home = (props: SearchParamsProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-5 flex flex-col gap-8">
      <div className="w-full flex flex-col gap-2 items-center mt-20">
        <h1 className="text-4xl font-semibold text-center">Your Snippets</h1>
        <p className="text-xl text-muted-foreground text-center">
          View, manage, sort, and search through your snippets.
        </p>
      </div>
      <Suspense fallback={<HomeLoading />}>
        <HomeSuspense {...props} />
      </Suspense>
    </div>
  );
};

const HomeLoading = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="size-9 shrink-0 rounded-md" />
        <Skeleton className="size-9 shrink-0 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SnippetCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

const HomeSuspense = async ({ searchParams }: SearchParamsProps) => {
  const options = await loadSnippetsSearchParams(searchParams);
  const response = await getSnippetsAction(options);
  if (!response) {
    return (
      <TextState
        error
        title="Something went wrong"
        description="We were unable to load your snippets. Try refreshing the page or come back later if the issue persists."
        classNames={{
          title: "text-xl",
        }}
      />
    );
  }

  const { data, nextCursor, key } = response;

  return (
    <div className="w-full flex flex-col gap-4">
      <SnippetsFilter />
      <SnippetsClientList
        initialSnippets={data}
        initialNextCursor={nextCursor}
        serverKey={key}
      />
    </div>
  );
};

export default Home;
