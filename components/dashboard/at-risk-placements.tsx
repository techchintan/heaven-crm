"use client";

import { AlertTriangle, Clock } from "lucide-react";
import type { Placement } from "@/lib/sanity-queries";
import { format, differenceInDays, parseISO } from "date-fns";

interface AtRiskPlacementsProps {
  placements: Placement[];
}

function formatCurrency(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export function AtRiskPlacements({ placements }: AtRiskPlacementsProps) {
  return (
    <div className="rounded-xl border border-warning/30 bg-warning-muted p-5">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h3 className="text-sm font-medium text-foreground">At-Risk Probations</h3>
        <span className="ml-auto rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
          {placements.length} active
        </span>
      </div>

      {placements.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No at-risk placements within 30 days
        </p>
      ) : (
        <div className="space-y-3">
          {placements.slice(0, 5).map((placement) => {
            const daysLeft = placement.probationEndDate
              ? differenceInDays(parseISO(placement.probationEndDate), new Date())
              : 0;

            return (
              <div
                key={placement._id}
                className="flex items-center justify-between rounded-lg bg-background/50 p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {placement.candidate?.fullName || "Unknown"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {placement.client?.companyName || "Unknown"} - {placement.jobTitle}
                  </p>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(placement.totalInvoiceValue || 0)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <Clock className="h-3 w-3" />
                    <span>{daysLeft} days left</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
