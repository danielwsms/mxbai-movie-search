import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieDetailSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6">
        <div className="md:col-span-4 flex justify-center md:justify-start">
          <Skeleton className="w-full aspect-[2/3] rounded-md" />
        </div>
        <div className="md:col-span-8 space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </div>
        </div>
      </div>
    </Card>
  );
}
