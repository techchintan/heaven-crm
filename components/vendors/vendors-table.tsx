"use client";

import {useState, useMemo} from "react";
import {Search, Filter, ExternalLink, Mail, Phone, Globe} from "lucide-react";
import {StatusBadge} from "@/components/ui/status-badge";
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

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.companyName?.toLowerCase().includes(searchLower) ||
          c.primaryContact?.toLowerCase().includes(searchLower) ||
          c.contactEmail?.toLowerCase().includes(searchLower),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Industry filter
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
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company, contact..."
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

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="border-border bg-input text-foreground focus:border-primary focus:ring-primary h-9 appearance-none rounded-lg border px-3 pr-8 text-sm focus:ring-1 focus:outline-none"
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors"
        >
          Add in Studio
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Results count */}
      <p className="text-muted-foreground text-sm">
        Showing {filteredVendors.length} of {vendors.length} vendors
      </p>

      {/* Table */}
      <div className="border-border bg-card overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-border text-muted-foreground border-b text-left text-xs font-medium">
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Primary Contact</th>
              <th className="px-4 py-3">Fee %</th>
              <th className="px-4 py-3">Payment Terms</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-muted-foreground py-8 text-center text-sm">
                  No vendors found
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => {
                const taxReg = primaryTaxRegistration(vendor.stateTaxRegistrations);
                const regCount = vendor.stateTaxRegistrations?.length ?? 0;

                return (
                  <tr key={vendor._id} className="hover:bg-card-hover text-sm transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-foreground font-medium">{vendor.companyName}</p>
                        {taxReg?.gstin && (
                          <p className="text-muted-foreground text-xs">GSTIN: {taxReg.gstin}</p>
                        )}
                        {regCount > 1 && (
                          <p className="text-muted-foreground text-xs">
                            {regCount} state registrations
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {vendor.industry ? industryLabels[vendor.industry] || vendor.industry : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-foreground">{vendor.primaryContact || "—"}</p>
                        {vendor.contactDesignation && (
                          <p className="text-muted-foreground text-xs">
                            {vendor.contactDesignation}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="text-foreground px-4 py-3">
                      {vendor.agreementFeePercentage ? `${vendor.agreementFeePercentage}%` : "-"}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {vendor.paymentTerms ? `${vendor.paymentTerms} days` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={vendor.status} variant="vendor" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {vendor.contactEmail && (
                          <a
                            href={`mailto:${vendor.contactEmail}`}
                            className="bg-muted text-muted-foreground hover:bg-card-hover hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {vendor.contactPhone && (
                          <a
                            href={`tel:${vendor.contactPhone}`}
                            className="bg-muted text-muted-foreground hover:bg-card-hover hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {vendor.website && (
                          <a
                            href={vendor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-muted text-muted-foreground hover:bg-card-hover hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                          >
                            <Globe className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
