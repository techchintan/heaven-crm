import {cn} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";
import {LucideIcon} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const iconVariantStyles = {
  default: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

/**
 * StatsCard Component
 *
 * A clean card component for displaying key metrics with consistent white backgrounds.
 */
export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-foreground text-2xl font-semibold tracking-tight">{value}</p>
            {description && <p className="text-muted-foreground text-xs">{description}</p>}
          </div>
          {Icon && (
            <div className={cn("mt-0.5", iconVariantStyles[variant])}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        {trend && (
          <div className="border-border mt-3 border-t pt-3">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-danger",
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
