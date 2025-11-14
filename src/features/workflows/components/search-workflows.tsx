"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { debounce, parseAsString, useQueryState } from "nuqs";

const SearchWorkflows = () => {
  const [query, setQuery] = useQueryState(
    "query",
    parseAsString
      .withDefault("")
      .withOptions({ limitUrlUpdates: debounce(1000) })
  );
  return (
    <div className="flex-1 relative">
      <Input
        placeholder="Search workflows"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <Search className="absolute right-2 top-2 size-4" />
    </div>
  );
};

export default SearchWorkflows;

