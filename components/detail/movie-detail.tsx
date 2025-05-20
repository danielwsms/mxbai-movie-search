import { Card } from "@/components/ui/card";
import { MovieData } from "@/types";
import { getHighResImageUrl } from "@/lib/utils";

export function MovieDetail({ movie }: { movie: MovieData }) {
  const highResImageUrl = getHighResImageUrl(movie.poster_path);

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6">
        <div className="md:col-span-4 flex justify-center md:justify-start">
          {movie.poster_path ? (
            <img
              src={highResImageUrl}
              alt={movie.title}
              className="rounded-md shadow-md max-h-[500px] object-contain"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-muted rounded-md flex items-center justify-center">
              No image available
            </div>
          )}
        </div>
        <div className="md:col-span-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              {movie.runtime && (
                <>
                  <span>•</span>
                  <span>{movie.runtime} min</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Rating:</span>
              <span className="px-2 py-0.5 rounded-md font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({movie.vote_count.toLocaleString()} votes)
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Overview</h2>
            <p className="text-muted-foreground">{movie.overview}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
