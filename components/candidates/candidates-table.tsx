"use client";

import {useState, useMemo} from "react";
import {Search, Filter, ExternalLink, Mail, Phone, Link2} from "lucide-react";
import {StatusBadge} from "@/components/ui/status-badge";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, skill, email, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 appearance-none rounded-md border border-border bg-card pl-9 pr-8 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary/90 active:scale-[0.98]"
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
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Candidate</TableHead>
              <TableHead>Primary Skill</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Expected Salary</TableHead>
              <TableHead>Notice Period</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{candidate.fullName}</p>
                      {candidate.email && (
                        <p className="text-xs text-muted-foreground">{candidate.email}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{candidate.primarySkill}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {candidate.experience ? `${candidate.experience} yrs` : "-"}
                  </TableCell>
                  <TableCell>{formatSalary(candidate.expectedSalary)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {candidate.noticePeriod ? `${candidate.noticePeriod} days` : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{candidate.location || "-"}</TableCell>
                  <TableCell>
                    <StatusBadge status={candidate.status} variant="candidate" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {candidate.email && (
                        <a
                          href={`mailto:${candidate.email}`}
                          title="Send email"
                          className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {candidate.phone && (
                        <a
                          href={`tel:${candidate.phone}`}
                          title="Call"
                          className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {candidate.linkedInUrl && (
                        <a
                          href={candidate.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View LinkedIn"
                          className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Link2 className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
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
