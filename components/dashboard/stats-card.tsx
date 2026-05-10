import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    success: "bg-success-muted border-success/20",
    warning: "bg-warning-muted border-warning/20",
    danger: "bg-danger-muted border-danger/20",
    info: "bg-info-muted border-info/20",
  };

  const iconVariantStyles = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    danger: "bg-danger/20 text-danger",
    info: "bg-info/20 text-info",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-5 transition-colors hover:border-border-hover",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              iconVariantStyles[variant]
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend.isPositive
                ? "bg-success/20 text-success"
                : "bg-danger/20 text-danger"
            )}
          >
            <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
