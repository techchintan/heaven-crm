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
      <CardHeader className="border-border border-b pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("pt-4", isLoading && "animate-pulse")}>{children}</CardContent>
      {footer && (
        <div className="border-border bg-muted/30 -mx-4 -mb-4 rounded-b-lg border-t px-4 py-3">
          {footer}
        </div>
      )}
    </Card>
  );
}
