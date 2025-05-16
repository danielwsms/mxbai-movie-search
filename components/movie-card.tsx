import { Card } from "@/components/ui/card";
import { MovieData } from "@/types";
import { getHighResImageUrl } from "@/lib/utils";

export function MovieCard({ movie }: { movie: MovieData }) {
  const highResImageUrl = getHighResImageUrl(movie.Poster_Link);

  return (
    <Card className="overflow-hidden flex flex-col h-full group p-0">
      <div className="aspect-[2/3] w-full relative bg-muted">
        {movie.Poster_Link && (
          <img
            src={highResImageUrl}
            alt={movie.Series_Title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
    </Card>
  );
}
