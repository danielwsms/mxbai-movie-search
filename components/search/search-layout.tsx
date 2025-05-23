"use client";

import { QuerySearch } from "./query-search";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import SuggestionList from "./suggestion-list";

export function SearchLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Movie Search</CardTitle>
          <CardDescription>
            Retrieve movies using semantic search
          </CardDescription>
        </CardHeader>

        <CardContent>
          <QuerySearch />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suggestions</CardTitle>
          <CardDescription>Try these queries to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <SuggestionList />
        </CardContent>
      </Card>
    </div>
  );
}
