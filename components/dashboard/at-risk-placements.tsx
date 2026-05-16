"use client";

import {AlertTriangle, Clock} from "lucide-react";
import type {Placement} from "@/lib/sanity-queries";
import {differenceInDays, parseISO} from "date-fns";

interface AtRiskPlacementsProps {
  placements: Placement[];
}

function formatCurrency(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export function AtRiskPlacements({placements}: AtRiskPlacementsProps) {
  return (
    <div className="border-warning/30 bg-warning-muted rounded-xl border p-5">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="text-warning h-4 w-4" />
        <h3 className="text-foreground text-sm font-medium">At-Risk Probations</h3>
        <span className="bg-warning/20 text-warning ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
          {placements.length} active
        </span>
      </div>

      {placements.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
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
                className="bg-background/50 flex items-center justify-between rounded-lg p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">
                    {placement.candidate?.fullName || "Unknown"}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {placement.vendor?.companyName || "Unknown"} - {placement.jobTitle}
                  </p>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <span className="text-foreground text-sm font-medium">
                    {formatCurrency(placement.totalInvoiceValue || 0)}
                  </span>
                  <div className="text-warning flex items-center gap-1 text-xs">
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
