"use client";

import { QuerySearch } from "./query-search";
import { FilterSearch } from "./filter-search";

export function SearchLayout() {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex gap-1 items-center">
        <QuerySearch />
      </div>
      <div className="flex-1 flex gap-1 items-center">
        <FilterSearch />
      </div>
    </div>
  );
}
