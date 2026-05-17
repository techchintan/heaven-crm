"use client";

import {useState, useMemo} from "react";
import {useRouter} from "next/navigation";
import {Search, Filter, ExternalLink, Mail, Phone, Link2} from "lucide-react";
import {StatusBadge} from "@/components/ui/status-badge";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
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
  const router = useRouter();
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
    {value: "immediately_available", label: "Immediately Available"},
    {value: "available_next_30_days", label: "Available (30 Days)"},
    {value: "on_notice_period", label: "On Notice"},
    {value: "placed", label: "Placed"},
    {value: "on_hold", label: "On Hold"},
    {value: "not_available", label: "Not Available"},
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by name, skill, email, location..."
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
          href="/studio/structure/candidate"
          target="_blank"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium shadow-sm transition-all duration-150 active:scale-[0.98]"
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
      <Card className="overflow-hidden p-0">
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
                <TableCell colSpan={8} className="text-muted-foreground py-10 text-center">
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate._id} className="cursor-pointer" onClick={() => router.push(`/candidates/${candidate._id}`)}>
                  <TableCell>
                    <div>
                      <p className="text-primary font-medium">{candidate.fullName}</p>
                      {candidate.email && (
                        <p className="text-muted-foreground text-xs">{candidate.email}</p>
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
                  <TableCell className="text-muted-foreground">
                    {candidate.location || "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={candidate.status} variant="candidate" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {candidate.email && (
                        <a
                          href={`mailto:${candidate.email}`}
                          title="Send email"
                          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-7 w-7 items-center justify-center rounded-sm transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {candidate.phone && (
                        <a
                          href={`tel:${candidate.phone}`}
                          title="Call"
                          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-7 w-7 items-center justify-center rounded-sm transition-colors"
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
                          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-7 w-7 items-center justify-center rounded-sm transition-colors"
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
