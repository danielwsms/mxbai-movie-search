import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MovieData } from "@/types";
import { getHighResImageUrl } from "@/lib/utils";

interface MovieRecommendationProps {
  movie: MovieData;
  score: number;
  id: string | number;
}

function MovieRecommendationCard({ movie, id }: MovieRecommendationProps) {
  const highResImageUrl = getHighResImageUrl(movie.poster_path);

  return (
    <Link href={`/movie/${id}`} className="block h-full">
      <Card className="overflow-hidden h-full group p-0 flex items-center justify-center hover:shadow-md transition-shadow relative">
        {movie.poster_path ? (
          <img
            src={highResImageUrl}
            alt={movie.title}
            className="h-full w-full scale-104 object-contain transition-transform duration-300 group-hover:scale-109"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center p-4 text-center text-muted-foreground">
            {movie.title}
          </div>
        )}
      </Card>
    </Link>
  );
}

export async function MovieRecommendations({
  movies,
}: {
  movies: Array<{ movie: MovieData; score: number; id: string | number }>;
}) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold md:text-2xl md:font-bold">
          You may also like
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {movies.map((item) => (
          <MovieRecommendationCard
            key={item.id}
            movie={item.movie}
            score={item.score}
            id={item.id}
          />
        ))}
      </div>
    </div>
  );
}
