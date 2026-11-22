"use client";

import { useDebouncedCallback } from "@tanstack/react-pacer";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export const SearchInput = ({
  initialValue,
  onSearch,
  placeholder = "Search...",
  className,
}: {
  initialValue: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  const [search, setSearch] = useState(initialValue);
  const [previousInitialValue, setPreviousInitialValue] =
    useState(initialValue);

  const debouncedSearch = useDebouncedCallback(onSearch, { wait: 300 });

  if (previousInitialValue !== initialValue) {
    setPreviousInitialValue(initialValue);
    setSearch(initialValue);
  }

  return (
    <InputGroup className={className}>
      <InputGroupInput
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          debouncedSearch(value);
        }}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};
