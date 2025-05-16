"use client";

import { QuerySearch } from "./query-search";
import { FilterSearch } from "./filter-search";
import { Card } from "@/components/ui/card";

export function SearchLayout() {
  return (
    <Card className="p-4 py-6 space-y-4 h-screen">
      <div className="space-y-2">
        <div className="space-y-1">
          <label htmlFor="query" className="text-sm font-medium">
            Movie Search
          </label>
          <p className="text-xs text-muted-foreground">
            Retrieve movies using semantic search
          </p>
        </div>
        <QuerySearch />
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="filter" className="text-sm font-medium">
            Result Filter
          </label>
          <p className="text-xs text-muted-foreground">
            Rerank your results using natural language
          </p>
        </div>
        <FilterSearch />
      </div>
    </Card>
  );
}
