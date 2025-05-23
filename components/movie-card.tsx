import { Card } from "@/components/ui/card";
import { MovieData } from "@/types";
import { getHighResImageUrl } from "@/lib/utils";
import Link from "next/link";

export function MovieCard({
  movie,
  id,
}: {
  movie: MovieData;
  id?: string | number;
}) {
  const highResImageUrl = getHighResImageUrl(movie.poster_path);

  return (
    <Link href={`/movie/${id}`} className="block h-full">
      <Card className="overflow-hidden h-full group p-0 flex items-center justify-center hover:shadow-md transition-shadow">
        {movie.poster_path ? (
          <img
            src={highResImageUrl}
            alt={movie.title}
            className="h-full w-full scale-104 object-contain transition-transform duration-300 group-hover:scale-109"
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
