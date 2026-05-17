"use client";

import {FileText} from "lucide-react";
import type {Placement} from "@/lib/sanity-queries";
import {format, parseISO} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

interface RecentPlacementsProps {
  placements: Placement[];
}

const statusConfig: Record<
  string,
  {label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "info"}
> = {
  pending: {label: "Pending", variant: "secondary"},
  invoiced: {label: "Invoiced", variant: "info"},
  paid: {label: "Paid", variant: "success"},
  deducted: {label: "Deducted", variant: "destructive"},
  partially_paid: {label: "Partial", variant: "warning"},
};

function formatCurrency(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export function RecentPlacements({placements}: RecentPlacementsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <FileText className="text-muted-foreground h-4 w-4" />
        <CardTitle className="text-sm font-semibold">Recent Placements</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {placements.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">No placements yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Candidate</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements.map((placement) => {
                const status = statusConfig[placement.revenueStatus] || statusConfig.pending;

                return (
                  <TableRow key={placement._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{placement.candidate?.fullName || "Unknown"}</p>
                        <p className="text-muted-foreground text-xs">{placement.jobTitle}</p>
                      </div>
                    </TableCell>
                    <TableCell>{placement.vendor?.companyName || "Unknown"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {placement.placementDate
                        ? format(parseISO(placement.placementDate), "dd/MM/yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(placement.totalInvoiceValue || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
