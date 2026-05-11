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
  default: "border-border",
  success: "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950",
  warning: "border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950",
  danger: "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950",
  info: "border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400",
  danger: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
  info: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
};

/**
 * StatsCard Component
 *
 * A reusable card component for displaying key metrics in dashboards.
 * Supports multiple variants, trend indicators, and custom icons.
 *
 * @param title - The label for this statistic
 * @param value - The primary metric value
 * @param description - Optional supporting text below the value
 * @param icon - Optional Lucide icon to display
 * @param trend - Optional object with trend value and direction
 * @param variant - Visual style: 'default' | 'success' | 'warning' | 'danger' | 'info'
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <StatsCard
 *   title="Total Revenue"
 *   value="₹2,45,000"
 *   description="Last 30 days"
 *   icon={TrendingUpIcon}
 *   trend={{ value: 12.5, isPositive: true }}
 *   variant="success"
 * />
 * ```
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-0.5">
          <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              iconVariantStyles[variant],
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2">
          <div className="flex-1">
            <div className="text-foreground text-2xl font-bold">{value}</div>
            {description && <p className="text-muted-foreground mt-1 text-xs">{description}</p>}
          </div>
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                trend.isPositive
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
                  : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
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
