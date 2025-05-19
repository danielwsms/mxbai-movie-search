import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden h-full p-0 flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <div className="w-full aspect-[2/3]">
              <Skeleton className="h-full w-full" />
            </div>
          </Card>
        ))}
    </div>
  );
}
