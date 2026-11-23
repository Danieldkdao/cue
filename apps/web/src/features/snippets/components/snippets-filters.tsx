"use client";

import {
  FilterLabel,
  MultiSelectFilter,
  SelectFilter,
} from "@/components/filter-components";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { snippetKinds } from "@cue/shared";
import { FilterIcon, PlusIcon } from "lucide-react";
import { useSnippetParams } from "../hooks/use-snippet-params";
import {
  formatSnippetKind,
  formatSnippetSortByOption,
} from "../lib/formatters";
import { snippetsSortByOptions } from "../lib/params";
import { SnippetDialog } from "./snippet-dialog";

export const SnippetsFilter = () => {
  const [options, setOptions] = useSnippetParams();

  return (
    <div className="flex items-center gap-2 w-full min-w-0">
      <SearchInput
        initialValue={options.search}
        onSearch={(search) => setOptions({ search })}
        placeholder="Search by snippet name, body, language, or use case"
      />
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" size="icon">
              <FilterIcon />
            </Button>
          }
        />
        <PopoverContent className="flex flex-col gap-4" align="end">
          <div className="flex flex-col gap-2">
            <FilterLabel>Sort By</FilterLabel>
            <SelectFilter
              value={options.sortBy}
              onValueChange={(sortBy) => setOptions({ sortBy })}
              format={formatSnippetSortByOption}
              options={snippetsSortByOptions}
              styleOptions={{ placeholder: "Sort by" }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FilterLabel>Kinds</FilterLabel>
            <MultiSelectFilter
              values={options.kinds}
              onValuesChange={(kinds) => setOptions({ kinds })}
              format={(kind) => formatSnippetKind(kind).label}
              options={snippetKinds}
              styleOptions={{ placeholder: "Filter by kind" }}
            />
          </div>
        </PopoverContent>
      </Popover>
      <SnippetDialog>
        <Button size="icon">
          <PlusIcon />
        </Button>
      </SnippetDialog>
    </div>
  );
};
