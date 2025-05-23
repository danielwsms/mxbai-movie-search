import { getMovieById, getSimilarMovies } from "@/actions/search";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/detail/back-button";
import { MovieDetail } from "@/components/detail/movie-detail";
import { MovieDetailSkeleton } from "@/components/detail/movie-detail-skeleton";
import { MovieRecommendations } from "@/components/detail/movie-recommendations";
import { MovieRecommendationsSkeleton } from "@/components/detail/movie-recommendations-skeleton";
import { Suspense } from "react";
import { Params } from "@/types";

function MovieNotFound() {
  return (
    <Card className="p-8">
      <div className="text-center text-muted-foreground">Movie not found</div>
    </Card>
  );
}

function MovieError({ error }: { error: Error }) {
  return (
    <Card className="p-8">
      <div className="text-center text-red-500">
        Error loading movie: {error.message || "Unknown error"}
      </div>
    </Card>
  );
}

async function MovieContent({ id }: { id: string }) {
  try {
    const movie = await getMovieById(id);

    if (!movie) {
      return <MovieNotFound />;
    }

    const similarMovies = await getSimilarMovies(id, { limit: 5 });

    return (
      <>
        <MovieDetail movie={movie} />
        <MovieRecommendations movies={similarMovies} />
      </>
    );
  } catch (error) {
    return (
      <MovieError
        error={error instanceof Error ? error : new Error("Unknown error")}
      />
    );
  }
}

export default async function MoviePage(props: { params: Params }) {
  const params = await props.params;

  return (
    <div>
      <BackButton />
      <Suspense
        fallback={
          <>
            <MovieDetailSkeleton />
            <MovieRecommendationsSkeleton />
          </>
        }
      >
        <MovieContent id={params.id} />
      </Suspense>
    </div>
  );
}
