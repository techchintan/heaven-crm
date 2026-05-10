"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ExternalLink, Mail, Phone, Linkedin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Candidate } from "@/lib/sanity-queries";

interface CandidatesTableProps {
  candidates: Candidate[];
}

function formatSalary(value?: number): string {
  if (!value) return "-";
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export function CandidatesTable({ candidates }: CandidatesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCandidates = useMemo(() => {
    let result = [...candidates];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.fullName?.toLowerCase().includes(searchLower) ||
          c.primarySkill?.toLowerCase().includes(searchLower) ||
          c.email?.toLowerCase().includes(searchLower) ||
          c.location?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    return result;
  }, [candidates, search, statusFilter]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "available", label: "Available" },
    { value: "placed", label: "Placed" },
    { value: "in_process", label: "In Process" },
    { value: "on_hold", label: "On Hold" },
    { value: "not_available", label: "Not Available" },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, skill, email, location..."
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
          href="/studio/structure/candidate"
          target="_blank"
          className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Add in Studio
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredCandidates.length} of {candidates.length} candidates
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Primary Skill</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Expected Salary</th>
              <th className="px-4 py-3">Notice Period</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  No candidates found
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => (
                <tr
                  key={candidate._id}
                  className="text-sm transition-colors hover:bg-card-hover"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {candidate.fullName}
                      </p>
                      {candidate.email && (
                        <p className="text-xs text-muted-foreground">
                          {candidate.email}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {candidate.primarySkill}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {candidate.experience ? `${candidate.experience} yrs` : "-"}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {formatSalary(candidate.expectedSalary)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {candidate.noticePeriod ? `${candidate.noticePeriod} days` : "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {candidate.location || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={candidate.status} variant="candidate" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {candidate.email && (
                        <a
                          href={`mailto:${candidate.email}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-card-hover hover:text-foreground"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {candidate.phone && (
                        <a
                          href={`tel:${candidate.phone}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-card-hover hover:text-foreground"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {candidate.linkedInUrl && (
                        <a
                          href={candidate.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-card-hover hover:text-foreground"
                        >
                          <Linkedin className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
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
