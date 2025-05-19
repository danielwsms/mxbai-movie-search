"use client";

import { QuerySearch } from "./query-search";
import { Card } from "@/components/ui/card";

export function SearchLayout() {
  return (
    <Card className="p-4 py-6 space-y-4">
      <div className="space-y-2">
        <div className="space-y-1">
          <label htmlFor="query" className="font-bold">
            Movie Search
          </label>
          <p className="text-xs text-muted-foreground">
            Retrieve movies using semantic search
          </p>
        </div>
        <QuerySearch />
      </div>
    </Card>
  );
}
