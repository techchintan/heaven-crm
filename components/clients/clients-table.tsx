"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ExternalLink, Mail, Phone, Globe } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Client } from "@/lib/sanity-queries";

interface ClientsTableProps {
  clients: Client[];
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

export function ClientsTable({ clients }: ClientsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");

  const filteredClients = useMemo(() => {
    let result = [...clients];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.companyName?.toLowerCase().includes(searchLower) ||
          c.primaryContact?.toLowerCase().includes(searchLower) ||
          c.contactEmail?.toLowerCase().includes(searchLower)
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
  }, [clients, search, statusFilter, industryFilter]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "prospect", label: "Prospect" },
    { value: "on_hold", label: "On Hold" },
  ];

  const industryOptions = [
    { value: "all", label: "All Industries" },
    ...Object.entries(industryLabels).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by company, contact..."
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

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="h-9 appearance-none rounded-lg border border-border bg-input px-3 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {industryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <a
          href="/studio/structure/client"
          target="_blank"
          className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Add in Studio
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredClients.length} of {clients.length} clients
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Primary Contact</th>
              <th className="px-4 py-3">Fee %</th>
              <th className="px-4 py-3">Payment Terms</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No clients found
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr
                  key={client._id}
                  className="text-sm transition-colors hover:bg-card-hover"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {client.companyName}
                      </p>
                      {client.gstin && (
                        <p className="text-xs text-muted-foreground">
                          GSTIN: {client.gstin}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {client.industry ? industryLabels[client.industry] || client.industry : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-foreground">{client.primaryContact}</p>
                      {client.contactDesignation && (
                        <p className="text-xs text-muted-foreground">
                          {client.contactDesignation}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {client.agreementFeePercentage
                      ? `${client.agreementFeePercentage}%`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {client.paymentTerms ? `${client.paymentTerms} days` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={client.status} variant="client" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {client.contactEmail && (
                        <a
                          href={`mailto:${client.contactEmail}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-card-hover hover:text-foreground"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {client.contactPhone && (
                        <a
                          href={`tel:${client.contactPhone}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-card-hover hover:text-foreground"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {client.website && (
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-card-hover hover:text-foreground"
                        >
                          <Globe className="h-3.5 w-3.5" />
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
