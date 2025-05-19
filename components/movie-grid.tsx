import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { MovieResults } from "@/components/movie-results";
import { MovieGridSkeleton } from "@/components/movie-skeleton";

export function MovieGrid({
  searchQuery,
}: {
  searchQuery?: string | string[] | null;
}) {
  const query =
    typeof searchQuery === "string"
      ? searchQuery
      : Array.isArray(searchQuery)
      ? searchQuery[0]
      : null;

  return (
    <Card>
      <Suspense fallback={<MovieGridSkeleton />}>
        <MovieResults query={query} />
      </Suspense>
    </Card>
  );
}
