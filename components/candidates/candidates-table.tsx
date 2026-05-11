"use client";

import {useState, useMemo} from "react";
import {Search, Filter, ExternalLink, Mail, Phone, Link2} from "lucide-react";
import {StatusBadge} from "@/components/ui/status-badge";
import type {Candidate} from "@/lib/sanity-queries";

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

export function CandidatesTable({candidates}: CandidatesTableProps) {
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
          c.location?.toLowerCase().includes(searchLower),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    return result;
  }, [candidates, search, statusFilter]);

  const statusOptions = [
    {value: "all", label: "All Status"},
    {value: "available", label: "Available"},
    {value: "placed", label: "Placed"},
    {value: "in_process", label: "In Process"},
    {value: "on_hold", label: "On Hold"},
    {value: "not_available", label: "Not Available"},
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, skill, email, location..."
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
          href="/studio/structure/candidate"
          target="_blank"
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors"
        >
          Add in Studio
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Results count */}
      <p className="text-muted-foreground text-sm">
        Showing {filteredCandidates.length} of {candidates.length} candidates
      </p>

      {/* Table */}
      <div className="border-border bg-card overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-border text-muted-foreground border-b text-left text-xs font-medium">
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
          <tbody className="divide-border divide-y">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-muted-foreground py-8 text-center text-sm">
                  No candidates found
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => (
                <tr key={candidate._id} className="hover:bg-card-hover text-sm transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-foreground font-medium">{candidate.fullName}</p>
                      {candidate.email && (
                        <p className="text-muted-foreground text-xs">{candidate.email}</p>
                      )}
                    </div>
                  </td>
                  <td className="text-foreground px-4 py-3">{candidate.primarySkill}</td>
                  <td className="text-muted-foreground px-4 py-3">
                    {candidate.experience ? `${candidate.experience} yrs` : "-"}
                  </td>
                  <td className="text-foreground px-4 py-3">
                    {formatSalary(candidate.expectedSalary)}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {candidate.noticePeriod ? `${candidate.noticePeriod} days` : "-"}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">{candidate.location || "-"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={candidate.status} variant="candidate" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {candidate.email && (
                        <a
                          href={`mailto:${candidate.email}`}
                          className="bg-muted text-muted-foreground hover:bg-card-hover hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {candidate.phone && (
                        <a
                          href={`tel:${candidate.phone}`}
                          className="bg-muted text-muted-foreground hover:bg-card-hover hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {candidate.linkedInUrl && (
                        <a
                          href={candidate.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-muted text-muted-foreground hover:bg-card-hover hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                        >
                          <Link2 className="h-3.5 w-3.5" />
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
