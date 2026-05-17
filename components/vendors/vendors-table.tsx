"use client";

import {useState, useMemo} from "react";
import {Search, Filter, ExternalLink, Mail, Phone, Globe} from "lucide-react";
import {StatusBadge} from "@/components/ui/status-badge";
import {Button} from "@/components/ui/button";
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
import type {Vendor, VendorStateTaxRegistration} from "@/lib/sanity-queries";

function primaryTaxRegistration(
  registrations: VendorStateTaxRegistration[] | undefined,
): VendorStateTaxRegistration | undefined {
  if (!registrations?.length) return undefined;
  return registrations.find((r) => r.isPrimary) ?? registrations[0];
}

interface VendorsTableProps {
  vendors: Vendor[];
}

const industryLabels: Record<string, string> = {
  it_software: "IT & Software",
  banking_finance: "Banking & Finance",
  healthcare: "Healthcare",
  manufacturing: "Manufacturing",
  ecommerce: "E-commerce",
  consulting: "Consulting",
  education: "Education",
  telecom: "Telecom",
  retail: "Retail",
  other: "Other",
};

export function VendorsTable({vendors}: VendorsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");

  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.companyName?.toLowerCase().includes(searchLower) ||
          c.primaryContact?.toLowerCase().includes(searchLower) ||
          c.contactEmail?.toLowerCase().includes(searchLower),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (industryFilter !== "all") {
      result = result.filter((c) => c.industry === industryFilter);
    }

    return result;
  }, [vendors, search, statusFilter, industryFilter]);

  const statusOptions = [
    {value: "all", label: "All Status"},
    {value: "active", label: "Active"},
    {value: "inactive", label: "Inactive"},
    {value: "prospect", label: "Prospect"},
    {value: "in_progress", label: "In Progress"},
    {value: "on_hold", label: "On Hold"},
  ];

  const industryOptions = [
    {value: "all", label: "All Industries"},
    ...Object.entries(industryLabels).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by company, contact..."
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

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="h-9 appearance-none rounded-md border border-border bg-card px-3 pr-8 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {industryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <a
          href="/studio/structure/vendor"
          target="_blank"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary/90 active:scale-[0.98]"
        >
          Add in Studio
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredVendors.length} of {vendors.length} vendors
      </p>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Fee %</TableHead>
              <TableHead>Payment Terms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No vendors found
                </TableCell>
              </TableRow>
            ) : (
              filteredVendors.map((vendor) => {
                const taxReg = primaryTaxRegistration(vendor.stateTaxRegistrations);
                const regCount = vendor.stateTaxRegistrations?.length ?? 0;

                return (
                  <TableRow key={vendor._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vendor.companyName}</p>
                        {taxReg?.gstin && (
                          <p className="text-xs text-muted-foreground">GSTIN: {taxReg.gstin}</p>
                        )}
                        {regCount > 1 && (
                          <p className="text-xs text-muted-foreground">
                            {regCount} state registrations
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vendor.industry ? industryLabels[vendor.industry] || vendor.industry : "-"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{vendor.primaryContact || "—"}</p>
                        {vendor.contactDesignation && (
                          <p className="text-xs text-muted-foreground">
                            {vendor.contactDesignation}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {vendor.agreementFeePercentage ? `${vendor.agreementFeePercentage}%` : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vendor.paymentTerms ? `${vendor.paymentTerms} days` : "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={vendor.status} variant="vendor" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {vendor.contactEmail && (
                          <a
                            href={`mailto:${vendor.contactEmail}`}
                            title="Send email"
                            className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {vendor.contactPhone && (
                          <a
                            href={`tel:${vendor.contactPhone}`}
                            title="Call"
                            className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {vendor.website && (
                          <a
                            href={vendor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Visit website"
                            className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Globe className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
