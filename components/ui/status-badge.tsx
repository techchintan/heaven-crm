import {Badge} from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  variant?: "placement" | "candidate" | "client";
  className?: string;
}

const placementStatusConfig: Record<
  string,
  {label: string; variant: "default" | "secondary" | "destructive" | "outline"}
> = {
  pending: {label: "Pending", variant: "secondary"},
  invoiced: {label: "Invoiced", variant: "outline"},
  paid: {label: "Paid", variant: "default"},
  deducted: {label: "Deducted", variant: "destructive"},
  partially_paid: {label: "Partial", variant: "outline"},
};

const candidateStatusConfig: Record<
  string,
  {label: string; variant: "default" | "secondary" | "destructive" | "outline"}
> = {
  available: {label: "Available", variant: "default"},
  placed: {label: "Placed", variant: "secondary"},
  in_process: {label: "In Process", variant: "outline"},
  on_hold: {label: "On Hold", variant: "secondary"},
  not_available: {label: "Not Available", variant: "destructive"},
};

const clientStatusConfig: Record<
  string,
  {label: string; variant: "default" | "secondary" | "destructive" | "outline"}
> = {
  active: {label: "Active", variant: "default"},
  inactive: {label: "Inactive", variant: "secondary"},
  prospect: {label: "Prospect", variant: "outline"},
  in_progress: {label: "In Progress", variant: "outline"},
  on_hold: {label: "On Hold", variant: "outline"},
};

/**
 * StatusBadge Component
 *
 * A semantic badge component for displaying status information across the application.
 * Uses shadcn Badge component with pre-configured status mappings.
 *
 * @param status - The status key to display
 * @param variant - The context type: 'placement' | 'candidate' | 'client'
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <StatusBadge status="paid" variant="placement" />
 * <StatusBadge status="available" variant="candidate" />
 * <StatusBadge status="active" variant="client" />
 * ```
 */
export function StatusBadge({status, variant = "placement", className}: StatusBadgeProps) {
  const configs = {
    placement: placementStatusConfig,
    candidate: candidateStatusConfig,
    client: clientStatusConfig,
  };

  const config = configs[variant][status] || {label: status, variant: "secondary" as const};

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
