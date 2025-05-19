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
              {movie.status && (
                <>
                  <span>•</span>
                  <span>{movie.status}</span>
                </>
              )}
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
              <span className="font-medium">IMDb Rating:</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({movie.vote_count.toLocaleString()} votes)
              </span>
            </div>
            {movie.tagline && (
              <div>
                <span className="font-medium">Tagline:</span>{" "}
                <span className="italic">"{movie.tagline}"</span>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Overview</h2>
            <p className="text-muted-foreground">{movie.overview}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-medium mb-2">Details</h2>
              <dl className="space-y-2">
                {movie.production_companies.length > 0 && (
                  <div>
                    <dt className="font-medium">Studios</dt>
                    <dd className="text-muted-foreground">
                      {movie.production_companies.join(", ")}
                    </dd>
                  </div>
                )}
                {movie.genres.length > 0 && (
                  <div>
                    <dt className="font-medium">Genres</dt>
                    <dd className="text-muted-foreground">
                      {movie.genres.join(", ")}
                    </dd>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <dt className="font-medium">Box Office</dt>
                    <dd className="text-muted-foreground">
                      ${movie.revenue.toLocaleString()}
                    </dd>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div>
                    <dt className="font-medium">Budget</dt>
                    <dd className="text-muted-foreground">
                      ${movie.budget.toLocaleString()}
                    </dd>
                  </div>
                )}
                {movie.imdb_id && (
                  <div>
                    <dt className="font-medium">IMDb</dt>
                    <dd>
                      <a
                        href={`https://www.imdb.com/title/${movie.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View on IMDb
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              {movie.keywords.length > 0 && (
                <>
                  <h2 className="text-lg font-medium mb-2">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted rounded-md text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
