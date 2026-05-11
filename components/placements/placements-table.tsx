"use client";

import {useState, useMemo} from "react";
import {Search, Filter, ExternalLink, ChevronUp, ChevronDown} from "lucide-react";
import {format, parseISO} from "date-fns";
import {StatusBadge} from "@/components/ui/status-badge";
import type {Placement} from "@/lib/sanity-queries";

interface PlacementsTableProps {
  placements: Placement[];
}

type SortField = "placementDate" | "totalInvoiceValue" | "candidateName" | "clientName";
type SortDirection = "asc" | "desc";

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function renderSortIcon(
  field: SortField,
  activeSortField: SortField,
  activeSortDirection: SortDirection,
) {
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

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.candidate?.fullName?.toLowerCase().includes(searchLower) ||
          p.client?.companyName?.toLowerCase().includes(searchLower) ||
          p.jobTitle?.toLowerCase().includes(searchLower) ||
          p.recruiter?.name?.toLowerCase().includes(searchLower),
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
            new Date(a.placementDate || 0).getTime() - new Date(b.placementDate || 0).getTime();
          break;
        case "totalInvoiceValue":
          comparison = (a.totalInvoiceValue || 0) - (b.totalInvoiceValue || 0);
          break;
        case "candidateName":
          comparison = (a.candidate?.fullName || "").localeCompare(b.candidate?.fullName || "");
          break;
        case "clientName":
          comparison = (a.client?.companyName || "").localeCompare(b.client?.companyName || "");
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
          <input
            type="text"
            placeholder="Search by candidate, client, job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-lg border pr-4 pl-9 text-sm focus:ring-1 focus:outline-none"
          />
        </div>

        <div className="relative">
          <Filter className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-border bg-input text-foreground focus:border-primary focus:ring-primary h-9 appearance-none rounded-lg border pr-8 pl-9 text-sm focus:ring-1 focus:outline-none"
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors"
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
      <div className="border-border bg-card overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-border text-muted-foreground border-b text-left text-xs font-medium">
              <th
                className="hover:text-foreground cursor-pointer px-4 py-3"
                onClick={() => handleSort("candidateName")}
              >
                <div className="flex items-center gap-1">
                  Candidate
                  {renderSortIcon("candidateName", sortField, sortDirection)}
                </div>
              </th>
              <th
                className="hover:text-foreground cursor-pointer px-4 py-3"
                onClick={() => handleSort("clientName")}
              >
                <div className="flex items-center gap-1">
                  Client
                  {renderSortIcon("clientName", sortField, sortDirection)}
                </div>
              </th>
              <th className="px-4 py-3">Recruiter</th>
              <th
                className="hover:text-foreground cursor-pointer px-4 py-3"
                onClick={() => handleSort("placementDate")}
              >
                <div className="flex items-center gap-1">
                  Placement Date
                  {renderSortIcon("placementDate", sortField, sortDirection)}
                </div>
              </th>
              <th className="px-4 py-3">Probation End</th>
              <th
                className="hover:text-foreground cursor-pointer px-4 py-3 text-right"
                onClick={() => handleSort("totalInvoiceValue")}
              >
                <div className="flex items-center justify-end gap-1">
                  Invoice Value
                  {renderSortIcon("totalInvoiceValue", sortField, sortDirection)}
                </div>
              </th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {filteredPlacements.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-muted-foreground py-8 text-center text-sm">
                  No placements found
                </td>
              </tr>
            ) : (
              filteredPlacements.map((placement) => (
                <tr key={placement._id} className="hover:bg-card-hover text-sm transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-foreground font-medium">
                        {placement.candidate?.fullName || "Unknown"}
                      </p>
                      <p className="text-muted-foreground text-xs">{placement.jobTitle}</p>
                    </div>
                  </td>
                  <td className="text-foreground px-4 py-3">
                    {placement.client?.companyName || "Unknown"}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {placement.recruiter?.name || "Unknown"}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {placement.placementDate
                      ? format(parseISO(placement.placementDate), "dd/MM/yyyy")
                      : "-"}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {placement.probationEndDate
                      ? format(parseISO(placement.probationEndDate), "dd/MM/yyyy")
                      : "-"}
                  </td>
                  <td className="text-foreground px-4 py-3 text-right font-medium">
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
