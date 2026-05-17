"use client";

import {AlertTriangle, Clock} from "lucide-react";
import type {PlacementsQueryResult} from "@/sanity.types";
import {differenceInDays, parseISO} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

interface AtRiskPlacementsProps {
  placements: PlacementsQueryResult;
}

function formatCurrency(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export function AtRiskPlacements({placements}: AtRiskPlacementsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-warning h-4 w-4" />
          <CardTitle className="text-sm font-semibold">At-Risk Probations</CardTitle>
        </div>
        <Badge variant="warning">{placements.length} active</Badge>
      </CardHeader>
      <CardContent>
        {placements.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
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
                  className="border-border bg-muted/30 flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {placement.candidate?.fullName || "Unknown"}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {placement.vendor?.companyName || "Unknown"} - {placement.jobTitle}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-1">
                    <span className="text-foreground text-sm font-semibold">
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
      </CardContent>
    </Card>
  );
}
