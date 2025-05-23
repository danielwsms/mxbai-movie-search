import { searchMovies } from "@/actions/search";
import { SearchLayout } from "@/components/search/search-layout";
import { MovieCard } from "@/components/movie-card";
import { MovieGridSkeleton } from "@/components/movie-grid-skeleton";
import { SearchParams } from "@/types";
import { Suspense } from "react";

export default async function MovieSearchPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.query as string;

  return (
    <div className="flex flex-col gap-4">
      <SearchLayout />
      <Suspense fallback={<MovieGridSkeleton />}>
        <MovieSearchResults searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}

async function MovieSearchResults({ searchQuery }: { searchQuery: string }) {
  if (!searchQuery || !searchQuery.trim()) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Enter a search query to find movies
      </div>
    );
  }

  try {
    const results = await searchMovies(searchQuery);

    if (!results || results.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-12">
          No movies found. Try a different search query.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {results.map((result) => (
          <MovieCard key={result.id} movie={result.movie} id={result.id} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center text-red-500 py-12">
        Error searching movies:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}
