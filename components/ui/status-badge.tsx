import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "placement" | "candidate" | "client";
}

const placementStatusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  invoiced: {
    label: "Invoiced",
    className: "bg-info/20 text-info",
  },
  paid: {
    label: "Paid",
    className: "bg-success/20 text-success",
  },
  deducted: {
    label: "Deducted",
    className: "bg-danger/20 text-danger",
  },
  partially_paid: {
    label: "Partial",
    className: "bg-warning/20 text-warning",
  },
};

const candidateStatusConfig: Record<string, { label: string; className: string }> = {
  available: {
    label: "Available",
    className: "bg-success/20 text-success",
  },
  placed: {
    label: "Placed",
    className: "bg-primary/20 text-primary",
  },
  in_process: {
    label: "In Process",
    className: "bg-warning/20 text-warning",
  },
  on_hold: {
    label: "On Hold",
    className: "bg-muted text-muted-foreground",
  },
  not_available: {
    label: "Not Available",
    className: "bg-danger/20 text-danger",
  },
};

const clientStatusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-success/20 text-success",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground",
  },
  prospect: {
    label: "Prospect",
    className: "bg-info/20 text-info",
  },
  on_hold: {
    label: "On Hold",
    className: "bg-warning/20 text-warning",
  },
};

export function StatusBadge({ status, variant = "placement" }: StatusBadgeProps) {
  const configs = {
    placement: placementStatusConfig,
    candidate: candidateStatusConfig,
    client: clientStatusConfig,
  };

  const config = configs[variant][status] || { label: status, className: "bg-muted text-muted-foreground" };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
