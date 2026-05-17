import {cn} from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
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

const variantStyles = {
  default: "",
  success: "border-success/20 bg-success-muted",
  warning: "border-warning/20 bg-warning-muted",
  danger: "border-danger/20 bg-danger-muted",
  info: "border-info/20 bg-info-muted",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
};

/**
 * StatsCard Component
 *
 * A reusable card component for displaying key metrics in dashboards.
 * Supports multiple variants, trend indicators, and custom icons.
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
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              iconVariantStyles[variant],
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
                trend.isPositive
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger",
              )}
            >
              <span>
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
