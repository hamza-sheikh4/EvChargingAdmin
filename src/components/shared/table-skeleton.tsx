import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

const widths = ["w-40", "w-20", "w-28", "w-16", "w-24"];

/** The shape of a table while its rows load: an avatar and name, then short cells. */
export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <Card padding="none" aria-busy="true" className="overflow-hidden">
      <div className="flex gap-6 border-b border-line px-5 py-3">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-3 w-16" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex items-center gap-6 border-b border-line px-5 py-3.5 last:border-b-0">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-md" />
            <div className="grid gap-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          {Array.from({ length: columns - 1 }, (_, column) => (
            <Skeleton key={column} className={`hidden h-3 sm:block ${widths[(row + column) % widths.length]}`} />
          ))}
        </div>
      ))}
    </Card>
  );
}
