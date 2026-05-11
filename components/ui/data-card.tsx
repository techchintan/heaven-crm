import {cn} from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

interface DataCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

/**
 * DataCard Component
 *
 * A flexible card wrapper for displaying tabular or list-based data.
 * Combines with Card components for consistent layout.
 *
 * @param title - Card heading
 * @param description - Optional subheading
 * @param children - Content to display
 * @param className - Additional CSS classes
 * @param footer - Optional footer content (pagination, actions)
 * @param isLoading - Shows skeleton state when true
 *
 * @example
 * ```tsx
 * <DataCard
 *   title="Recent Placements"
 *   description="Last 10 placements"
 *   footer={<Pagination />}
 * >
 *   <PlacementsTable data={data} />
 * </DataCard>
 * ```
 */
export function DataCard({
  title,
  description,
  children,
  className,
  footer,
  isLoading,
}: DataCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn(isLoading && "animate-pulse")}>{children}</CardContent>
      {footer && <div className="border-border border-t px-6 py-4">{footer}</div>}
    </Card>
  );
}
