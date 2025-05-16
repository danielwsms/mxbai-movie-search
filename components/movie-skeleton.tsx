import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden flex flex-col">
            <div className="aspect-[2/3] relative">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </Card>
        ))}
    </div>
  );
}
