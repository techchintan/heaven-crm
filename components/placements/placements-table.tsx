"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { Placement } from "@/lib/sanity-queries";

interface PlacementsTableProps {
  placements: Placement[];
}

type SortField = "placementDate" | "totalInvoiceValue" | "candidateName" | "clientName";
type SortDirection = "asc" | "desc";

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function PlacementsTable({ placements }: PlacementsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("placementDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredPlacements = useMemo(() => {
    let result = [...placements];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.candidate?.fullName?.toLowerCase().includes(searchLower) ||
          p.client?.companyName?.toLowerCase().includes(searchLower) ||
          p.jobTitle?.toLowerCase().includes(searchLower) ||
          p.recruiter?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.revenueStatus === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "placementDate":
          comparison =
            new Date(a.placementDate || 0).getTime() -
            new Date(b.placementDate || 0).getTime();
          break;
        case "totalInvoiceValue":
          comparison = (a.totalInvoiceValue || 0) - (b.totalInvoiceValue || 0);
          break;
        case "candidateName":
          comparison = (a.candidate?.fullName || "").localeCompare(
            b.candidate?.fullName || ""
          );
          break;
        case "clientName":
          comparison = (a.client?.companyName || "").localeCompare(
            b.client?.companyName || ""
          );
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "invoiced", label: "Invoiced" },
    { value: "paid", label: "Paid" },
    { value: "deducted", label: "Deducted" },
    { value: "partially_paid", label: "Partial" },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by candidate, client, job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-input pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-border bg-input pl-9 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
          className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Add in Studio
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredPlacements.length} of {placements.length} placements
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th
                className="cursor-pointer px-4 py-3 hover:text-foreground"
                onClick={() => handleSort("candidateName")}
              >
                <div className="flex items-center gap-1">
                  Candidate
                  <SortIcon field="candidateName" />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-foreground"
                onClick={() => handleSort("clientName")}
              >
                <div className="flex items-center gap-1">
                  Client
                  <SortIcon field="clientName" />
                </div>
              </th>
              <th className="px-4 py-3">Recruiter</th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-foreground"
                onClick={() => handleSort("placementDate")}
              >
                <div className="flex items-center gap-1">
                  Placement Date
                  <SortIcon field="placementDate" />
                </div>
              </th>
              <th className="px-4 py-3">Probation End</th>
              <th
                className="cursor-pointer px-4 py-3 text-right hover:text-foreground"
                onClick={() => handleSort("totalInvoiceValue")}
              >
                <div className="flex items-center justify-end gap-1">
                  Invoice Value
                  <SortIcon field="totalInvoiceValue" />
                </div>
              </th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPlacements.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No placements found
                </td>
              </tr>
            ) : (
              filteredPlacements.map((placement) => (
                <tr
                  key={placement._id}
                  className="text-sm transition-colors hover:bg-card-hover"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {placement.candidate?.fullName || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {placement.jobTitle}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {placement.client?.companyName || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {placement.recruiter?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {placement.placementDate
                      ? format(parseISO(placement.placementDate), "dd/MM/yyyy")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {placement.probationEndDate
                      ? format(parseISO(placement.probationEndDate), "dd/MM/yyyy")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    {formatCurrency(placement.totalInvoiceValue || 0)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={placement.revenueStatus} variant="placement" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
