import {Suspense} from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, ExternalLink, Mail, Phone, Globe, Building2} from "lucide-react";
import {getVendorById, getPlacementsByVendor} from "@/lib/sanity-queries";
import {formatCurrency, formatDate, formatStatus} from "@/lib/format";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {StatusBadge} from "@/components/ui/status-badge";
import {DetailSection, DetailField} from "@/components/ui/detail-section";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

function VendorDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="bg-muted h-8 w-48 rounded" />
      <div className="bg-muted h-40 rounded-lg" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-muted h-64 rounded-lg" />
        <div className="bg-muted h-64 rounded-lg" />
      </div>
    </div>
  );
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

const feeModelLabels: Record<string, string> = {
  percent_ctc: "% of Annual CTC",
  flat_per_hire: "Flat Fee per Hire",
};

const leadSourceLabels: Record<string, string> = {
  inbound: "Inbound / Website",
  referral: "Referral",
  outbound: "Outbound / BD",
  job_board: "Job Board / Marketplace",
  event: "Event",
  expansion: "Existing Vendor Expansion",
  other: "Other",
};

async function VendorDetailContent({id}: {id: string}) {
  const [vendor, placements] = await Promise.all([getVendorById(id), getPlacementsByVendor(id)]);

  if (!vendor) {
    notFound();
  }

  const totalRevenue = placements.reduce((sum, p) => sum + (p.totalInvoiceValue || 0), 0);
  const paidRevenue = placements
    .filter((p) => p.revenueStatus === "paid")
    .reduce((sum, p) => sum + (p.amountReceived || p.totalInvoiceValue || 0), 0);

  const initials = vendor.companyName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 p-6">
      {/* Back nav and header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/vendors"
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold">
            {initials}
          </div>
          <div>
            <h1 className="text-foreground text-xl font-semibold tracking-tight">
              {vendor.companyName}
            </h1>
            <p className="text-muted-foreground text-sm">
              {vendor.industry ? industryLabels[vendor.industry] || vendor.industry : "Vendor"}
              {vendor.legalName && vendor.legalName !== vendor.companyName
                ? ` \u00b7 ${vendor.legalName}`
                : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={vendor.status} variant="vendor" />
          <a
            href={`/studio/structure/vendor;${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium shadow-sm transition-colors"
          >
            Edit in Studio
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-primary-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Building2 className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Placements</p>
              <p className="text-foreground text-lg font-semibold">{placements.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-info-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Building2 className="text-info h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Billed</p>
              <p className="text-foreground text-lg font-semibold">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-success-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Building2 className="text-success h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Collected</p>
              <p className="text-foreground text-lg font-semibold">{formatCurrency(paidRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-warning-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Building2 className="text-warning h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Fee</p>
              <p className="text-foreground text-lg font-semibold">
                {vendor.agreementFeePercentage ? `${vendor.agreementFeePercentage}%` : "--"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          {/* Company Overview */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Company Overview</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField label="Company Name" value={vendor.companyName} />
                <DetailField label="Legal Name" value={vendor.legalName} />
                <DetailField
                  label="Industry"
                  value={
                    vendor.industry ? industryLabels[vendor.industry] || vendor.industry : null
                  }
                />
                <DetailField
                  label="Website"
                  value={
                    vendor.website ? (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary flex items-center gap-1 hover:underline"
                      >
                        <Globe className="h-3 w-3" />
                        {vendor.website.replace(/^https?:\/\//i, "")}
                      </a>
                    ) : null
                  }
                />
                <DetailField
                  label="Lead Source"
                  value={
                    vendor.leadSource
                      ? leadSourceLabels[vendor.leadSource] || formatStatus(vendor.leadSource)
                      : null
                  }
                />
                <DetailField
                  label="Added On"
                  value={vendor.createdAt ? formatDate(vendor.createdAt) : null}
                />
              </DetailSection>
            </CardContent>
          </Card>

          {/* Commercial Terms */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Commercial Terms</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField
                  label="Fee Model"
                  value={
                    vendor.feeModel
                      ? feeModelLabels[vendor.feeModel] || formatStatus(vendor.feeModel)
                      : null
                  }
                />
                <DetailField
                  label="Fee Percentage"
                  value={vendor.agreementFeePercentage ? `${vendor.agreementFeePercentage}%` : null}
                />
                <DetailField
                  label="Payment Terms"
                  value={vendor.paymentTerms ? `Net ${vendor.paymentTerms} days` : null}
                />
                <DetailField
                  label="MSA Start"
                  value={vendor.msaStartDate ? formatDate(vendor.msaStartDate) : null}
                />
                <DetailField
                  label="MSA End"
                  value={vendor.msaEndDate ? formatDate(vendor.msaEndDate) : null}
                />
              </DetailSection>
            </CardContent>
          </Card>

          {/* Billing */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Billing Details</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField label="Billing Email" value={vendor.billingEmail} />
                <DetailField label="Billing Address" value={vendor.billingAddress} fullWidth />
              </DetailSection>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Contacts */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">
                Points of Contact ({vendor.contacts?.length || 0})
              </h2>
            </CardHeader>
            <CardContent>
              {vendor.contacts && vendor.contacts.length > 0 ? (
                <div className="space-y-4">
                  {vendor.contacts.map((contact, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-4 ${contact.isPrimary ? "border-primary/30 bg-primary-muted" : "border-border"} ${contact.isActive === false ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-foreground font-medium">{contact.name}</p>
                          {contact.designation && (
                            <p className="text-muted-foreground text-sm">{contact.designation}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {contact.isPrimary && <Badge variant="default">Primary</Badge>}
                          {contact.isActive === false && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {contact.email}
                          </a>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {contact.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No contacts added yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Tax Registrations */}
          {vendor.stateTaxRegistrations && vendor.stateTaxRegistrations.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <h2 className="text-foreground text-base font-semibold">
                  State Tax Registrations ({vendor.stateTaxRegistrations.length})
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vendor.stateTaxRegistrations.map((reg, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-4 ${reg.isPrimary ? "border-primary/30 bg-primary-muted" : "border-border"}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-foreground font-medium">
                          {reg.state}
                          {reg.branchName ? ` \u2013 ${reg.branchName}` : ""}
                        </p>
                        {reg.isPrimary && <Badge variant="default">Primary</Badge>}
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {reg.gstin && (
                          <p className="text-muted-foreground text-sm">
                            <span className="text-foreground font-medium">GSTIN:</span> {reg.gstin}
                          </p>
                        )}
                        {reg.pan && (
                          <p className="text-muted-foreground text-sm">
                            <span className="text-foreground font-medium">PAN:</span> {reg.pan}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Notes */}
      {vendor.notes && (
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-foreground text-base font-semibold">Internal Notes</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">{vendor.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Placement History */}
      {placements.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-foreground text-base font-semibold">
              Placement History ({placements.length})
            </h2>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Recruiter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placements.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      <Link
                        href={`/placements/${p._id}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {p.candidate?.fullName || "--"}
                      </Link>
                    </TableCell>
                    <TableCell>{p.jobTitle}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.recruiter?.name || "--"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.placementDate ? formatDate(p.placementDate) : "--"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(p.totalInvoiceValue || 0)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.revenueStatus} variant="placement" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default async function VendorDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  return (
    <div className="flex flex-col">
      <Suspense fallback={<VendorDetailSkeleton />}>
        <VendorDetailContent id={id} />
      </Suspense>
    </div>
  );
}
