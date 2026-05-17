import {Badge} from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  variant?: "placement" | "candidate" | "vendor";
  className?: string;
}

const placementStatusConfig: Record<
  string,
  {label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"}
> = {
  pending: {label: "Pending", variant: "secondary"},
  invoiced: {label: "Invoiced", variant: "info"},
  paid: {label: "Paid", variant: "success"},
  deducted: {label: "Deducted", variant: "destructive"},
  partially_paid: {label: "Partial", variant: "warning"},
};

const candidateStatusConfig: Record<
  string,
  {label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"}
> = {
  available: {label: "Available", variant: "success"},
  placed: {label: "Placed", variant: "default"},
  in_process: {label: "In Process", variant: "info"},
  on_hold: {label: "On Hold", variant: "warning"},
  not_available: {label: "Not Available", variant: "secondary"},
};

const vendorStatusConfig: Record<
  string,
  {label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"}
> = {
  active: {label: "Active", variant: "success"},
  inactive: {label: "Inactive", variant: "secondary"},
  prospect: {label: "Prospect", variant: "info"},
  in_progress: {label: "In Progress", variant: "warning"},
  on_hold: {label: "On Hold", variant: "secondary"},
};

/**
 * StatusBadge Component
 *
 * A semantic badge component for displaying status information across the application.
 */
export function StatusBadge({status, variant = "placement", className}: StatusBadgeProps) {
  const configs = {
    placement: placementStatusConfig,
    candidate: candidateStatusConfig,
    vendor: vendorStatusConfig,
  };

  const config = configs[variant][status] || {label: status, variant: "secondary" as const};

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
