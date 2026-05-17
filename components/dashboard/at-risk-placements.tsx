"use client";

import {AlertTriangle, Clock} from "lucide-react";
import type {Placement} from "@/lib/sanity-queries";
import {differenceInDays, parseISO} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

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
    <Card className="border-warning/20 bg-warning-muted">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-warning/20 pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <CardTitle className="text-sm font-semibold">At-Risk Probations</CardTitle>
        </div>
        <Badge variant="warning">{placements.length} active</Badge>
      </CardHeader>
      <CardContent className="pt-4">
        {placements.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
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
                  className="flex items-center justify-between rounded-lg border border-warning/10 bg-card p-3 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {placement.candidate?.fullName || "Unknown"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {placement.vendor?.companyName || "Unknown"} - {placement.jobTitle}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-foreground">
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
      </CardContent>
    </Card>
  );
}
