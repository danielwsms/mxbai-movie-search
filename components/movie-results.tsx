import { searchMovies } from "@/actions/search";
import { MovieCard } from "./movie-card";

export async function MovieResults({ query }: { query: string | null }) {
  if (!query) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Search for movies to see results
      </div>
    );
  }

  try {
    const results = await searchMovies(query, { limit: 20 });

    if (results.length === 0) {
      return (
        <div className="text-center p-8 text-muted-foreground">
          No movies found for "{query}"
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {results.map((result) => (
          <MovieCard key={String(result.id)} movie={result.movie} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading results:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}
