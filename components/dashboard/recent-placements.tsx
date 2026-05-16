"use client";

import {FileText} from "lucide-react";
import type {Placement} from "@/lib/sanity-queries";
import {format, parseISO} from "date-fns";
import {cn} from "@/lib/utils";

interface RecentPlacementsProps {
  placements: Placement[];
}

const statusConfig: Record<string, {label: string; className: string}> = {
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

function formatCurrency(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export function RecentPlacements({placements}: RecentPlacementsProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-5">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="text-muted-foreground h-4 w-4" />
        <h3 className="text-foreground text-sm font-medium">Recent Placements</h3>
      </div>

      {placements.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">No placements yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left text-xs font-medium">
                <th className="pr-4 pb-3">Candidate</th>
                <th className="pr-4 pb-3">Vendor</th>
                <th className="pr-4 pb-3">Date</th>
                <th className="pr-4 pb-3 text-right">Value</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {placements.map((placement) => {
                const status = statusConfig[placement.revenueStatus] || statusConfig.pending;

                return (
                  <tr key={placement._id} className="text-sm">
                    <td className="py-3 pr-4">
                      <div>
                        <p className="text-foreground font-medium">
                          {placement.candidate?.fullName || "Unknown"}
                        </p>
                        <p className="text-muted-foreground text-xs">{placement.jobTitle}</p>
                      </div>
                    </td>
                    <td className="text-foreground py-3 pr-4">
                      {placement.vendor?.companyName || "Unknown"}
                    </td>
                    <td className="text-muted-foreground py-3 pr-4">
                      {placement.placementDate
                        ? format(parseISO(placement.placementDate), "dd/MM/yyyy")
                        : "-"}
                    </td>
                    <td className="text-foreground py-3 pr-4 text-right font-medium">
                      {formatCurrency(placement.totalInvoiceValue || 0)}
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
