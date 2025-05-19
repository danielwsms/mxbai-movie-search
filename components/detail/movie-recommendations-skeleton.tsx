import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function MovieRecommendationCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="p-2 flex flex-col h-full">
        <Skeleton className="aspect-[2/3] mb-2 rounded-md" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-1/2 mt-1" />
      </div>
    </Card>
  );
}

export function MovieRecommendationsSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <MovieRecommendationCardSkeleton key={i} />
          ))}
      </div>
    </div>
  );
}
