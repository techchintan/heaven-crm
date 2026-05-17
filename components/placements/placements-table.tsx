"use client";

import {useState, useMemo} from "react";
import {Search, Filter, ExternalLink, ChevronUp, ChevronDown} from "lucide-react";
import {format, parseISO} from "date-fns";
import {StatusBadge} from "@/components/ui/status-badge";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import type {Placement} from "@/lib/sanity-queries";

interface PlacementsTableProps {
  placements: Placement[];
}

type SortField = "placementDate" | "totalInvoiceValue" | "candidateName" | "vendorName";
type SortDirection = "asc" | "desc";

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function SortIcon({
  field,
  activeSortField,
  activeSortDirection,
}: {
  field: SortField;
  activeSortField: SortField;
  activeSortDirection: SortDirection;
}) {
  if (activeSortField !== field) return null;
  return activeSortDirection === "asc" ? (
    <ChevronUp className="h-3 w-3" />
  ) : (
    <ChevronDown className="h-3 w-3" />
  );
}

export function PlacementsTable({placements}: PlacementsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("placementDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredPlacements = useMemo(() => {
    let result = [...placements];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.candidate?.fullName?.toLowerCase().includes(searchLower) ||
          p.vendor?.companyName?.toLowerCase().includes(searchLower) ||
          p.jobTitle?.toLowerCase().includes(searchLower) ||
          p.recruiter?.name?.toLowerCase().includes(searchLower),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.revenueStatus === statusFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "placementDate":
          comparison =
            new Date(a.placementDate || 0).getTime() - new Date(b.placementDate || 0).getTime();
          break;
        case "totalInvoiceValue":
          comparison = (a.totalInvoiceValue || 0) - (b.totalInvoiceValue || 0);
          break;
        case "candidateName":
          comparison = (a.candidate?.fullName || "").localeCompare(b.candidate?.fullName || "");
          break;
        case "vendorName":
          comparison = (a.vendor?.companyName || "").localeCompare(b.vendor?.companyName || "");
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [placements, search, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const statusOptions = [
    {value: "all", label: "All Status"},
    {value: "pending", label: "Pending"},
    {value: "invoiced", label: "Invoiced"},
    {value: "paid", label: "Paid"},
    {value: "deducted", label: "Deducted"},
    {value: "partially_paid", label: "Partial"},
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by candidate, vendor, job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="relative">
          <Filter className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-border bg-card text-foreground focus:ring-ring h-9 appearance-none rounded-md border pr-8 pl-9 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <a
          href="/studio/structure/placement"
          target="_blank"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium shadow-sm transition-all duration-150 active:scale-[0.98]"
        >
          Add in Studio
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Results count */}
      <p className="text-muted-foreground text-sm">
        Showing {filteredPlacements.length} of {placements.length} placements
      </p>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead
                className="hover:text-foreground cursor-pointer select-none"
                onClick={() => handleSort("candidateName")}
              >
                <div className="flex items-center gap-1">
                  Candidate
                  <SortIcon
                    field="candidateName"
                    activeSortField={sortField}
                    activeSortDirection={sortDirection}
                  />
                </div>
              </TableHead>
              <TableHead
                className="hover:text-foreground cursor-pointer select-none"
                onClick={() => handleSort("vendorName")}
              >
                <div className="flex items-center gap-1">
                  Vendor
                  <SortIcon
                    field="vendorName"
                    activeSortField={sortField}
                    activeSortDirection={sortDirection}
                  />
                </div>
              </TableHead>
              <TableHead>Recruiter</TableHead>
              <TableHead
                className="hover:text-foreground cursor-pointer select-none"
                onClick={() => handleSort("placementDate")}
              >
                <div className="flex items-center gap-1">
                  Placement Date
                  <SortIcon
                    field="placementDate"
                    activeSortField={sortField}
                    activeSortDirection={sortDirection}
                  />
                </div>
              </TableHead>
              <TableHead>Probation End</TableHead>
              <TableHead
                className="hover:text-foreground cursor-pointer text-right select-none"
                onClick={() => handleSort("totalInvoiceValue")}
              >
                <div className="flex items-center justify-end gap-1">
                  Invoice Value
                  <SortIcon
                    field="totalInvoiceValue"
                    activeSortField={sortField}
                    activeSortDirection={sortDirection}
                  />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlacements.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="text-muted-foreground py-10 text-center">
                  No placements found
                </TableCell>
              </TableRow>
            ) : (
              filteredPlacements.map((placement) => (
                <TableRow key={placement._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{placement.candidate?.fullName || "Unknown"}</p>
                      <p className="text-muted-foreground text-xs">{placement.jobTitle}</p>
                    </div>
                  </TableCell>
                  <TableCell>{placement.vendor?.companyName || "Unknown"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {placement.recruiter?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {placement.placementDate
                      ? format(parseISO(placement.placementDate), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {placement.probationEndDate
                      ? format(parseISO(placement.probationEndDate), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(placement.totalInvoiceValue || 0)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={placement.revenueStatus} variant="placement" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
