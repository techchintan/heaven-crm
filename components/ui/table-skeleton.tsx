import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * TableSkeleton Component
 *
 * Loading placeholder for data tables using shadcn Skeleton components.
 * Provides visual feedback while data is loading.
 *
 * @param rows - Number of rows to display (default: 5)
 * @param columns - Number of columns to display (default: 4)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <TableSkeleton rows={8} columns={5} />
 * ) : (
 *   <DataTable data={data} />
 * )}
 * ```
 */
export function TableSkeleton({rows = 5, columns = 4, className}: TableSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({length: rows}).map((_, i) => (
        <div key={i} className="flex gap-2">
          {Array.from({length: columns}).map((_, j) => (
            <Skeleton key={j} className={cn("h-8 rounded-md", j === 0 ? "w-12" : "flex-1")} />
          ))}
        </div>
      ))}
    </div>
  );
}
