import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full p-0 flex items-center justify-center hover:shadow-md transition-shadow">
      <div className="w-full aspect-[2/3]">
        <Skeleton className="h-full w-full animate-pulse bg-muted/50" />
      </div>
    </Card>
  );
}

export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array(24)
        .fill(0)
        .map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
    </div>
  );
}
