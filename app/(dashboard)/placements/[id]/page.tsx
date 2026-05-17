import {Suspense} from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, ExternalLink, Calendar, IndianRupee, Briefcase} from "lucide-react";
import {getPlacementById} from "@/lib/sanity-queries";
import {formatCurrency, formatDate, formatStatus} from "@/lib/format";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {StatusBadge} from "@/components/ui/status-badge";
import {DetailSection, DetailField} from "@/components/ui/detail-section";
import {Separator} from "@/components/ui/separator";

function PlacementDetailSkeleton() {
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

const engagementLabels: Record<string, string> = {
  permanent: "Permanent",
  contract: "Contract",
  contract_to_hire: "Contract-to-Hire",
  temporary: "Temporary / Staffing",
};

const workArrangementLabels: Record<string, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
  flexible: "Flexible",
};

async function PlacementDetailContent({id}: {id: string}) {
  const placement = await getPlacementById(id);

  if (!placement) {
    notFound();
  }

  const feeDisplay =
    placement.feeMode === "flat"
      ? `Flat Fee: ${formatCurrency(placement.flatFeeAmount || 0)}`
      : `${placement.feePercentage || 0}% of CTC`;

  return (
    <div className="space-y-6 p-6">
      {/* Back nav and title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/placements"
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-foreground text-xl font-semibold tracking-tight">
              {placement.candidate?.fullName || "Unknown Candidate"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {placement.jobTitle} at {placement.vendor?.companyName || "Unknown Vendor"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={placement.revenueStatus} variant="placement" />
          <a
            href={`/studio/structure/placement;${id}`}
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
              <IndianRupee className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Invoice Value</p>
              <p className="text-foreground text-lg font-semibold">
                {formatCurrency(placement.totalInvoiceValue || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-success-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <IndianRupee className="text-success h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Received</p>
              <p className="text-foreground text-lg font-semibold">
                {formatCurrency(placement.amountReceived || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-info-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Calendar className="text-info h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Placement Date</p>
              <p className="text-foreground text-lg font-semibold">
                {placement.placementDate ? formatDate(placement.placementDate) : "--"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-warning-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Briefcase className="text-warning h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Engagement</p>
              <p className="text-foreground text-lg font-semibold">
                {placement.engagementType
                  ? engagementLabels[placement.engagementType] ||
                    formatStatus(placement.engagementType)
                  : "--"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          {/* Parties */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Placement Details</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <DetailSection title="Candidate">
                <DetailField
                  label="Name"
                  value={
                    placement.candidate ? (
                      <Link
                        href={`/candidates/${placement.candidate._id}`}
                        className="text-primary hover:underline"
                      >
                        {placement.candidate.fullName}
                      </Link>
                    ) : null
                  }
                />
                <DetailField label="Primary Skill" value={placement.candidate?.primarySkill} />
              </DetailSection>
              <Separator />
              <DetailSection title="Vendor">
                <DetailField
                  label="Company"
                  value={
                    placement.vendor ? (
                      <Link
                        href={`/vendors/${placement.vendor._id}`}
                        className="text-primary hover:underline"
                      >
                        {placement.vendor.companyName}
                      </Link>
                    ) : null
                  }
                />
                <DetailField
                  label="Payment Terms"
                  value={
                    placement.vendor?.paymentTerms ? `${placement.vendor.paymentTerms} days` : null
                  }
                />
              </DetailSection>
              <Separator />
              <DetailSection title="Recruiter">
                <DetailField
                  label="Name"
                  value={
                    placement.recruiter ? (
                      <Link
                        href={`/team/${placement.recruiter._id}`}
                        className="text-primary hover:underline"
                      >
                        {placement.recruiter.name}
                      </Link>
                    ) : null
                  }
                />
                <DetailField
                  label="Role"
                  value={placement.recruiter?.role ? formatStatus(placement.recruiter.role) : null}
                />
              </DetailSection>
            </CardContent>
          </Card>

          {/* Role & Engagement */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Role &amp; Engagement</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField label="Job Title" value={placement.jobTitle} />
                <DetailField
                  label="Engagement Type"
                  value={
                    placement.engagementType
                      ? engagementLabels[placement.engagementType] ||
                        formatStatus(placement.engagementType)
                      : null
                  }
                />
                <DetailField
                  label="Work Arrangement"
                  value={
                    placement.workArrangement
                      ? workArrangementLabels[placement.workArrangement] ||
                        formatStatus(placement.workArrangement)
                      : null
                  }
                />
                <DetailField label="Work Location" value={placement.workLocation} />
                <DetailField label="Vendor PO / Reference" value={placement.vendorReference} />
              </DetailSection>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Financials */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Financials</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <DetailSection title="Fee Inputs">
                <DetailField
                  label="Base Salary (p.a.)"
                  value={formatCurrency(placement.baseSalary)}
                />
                <DetailField label="Fee Structure" value={feeDisplay} />
                <DetailField label="GST Rate" value={`${placement.gstPercentage || 18}%`} />
              </DetailSection>
              <Separator />
              <DetailSection title="Invoice Totals">
                <DetailField label="Fee Amount" value={formatCurrency(placement.feeAmount || 0)} />
                <DetailField label="GST Amount" value={formatCurrency(placement.gstAmount || 0)} />
                <DetailField
                  label="Total Invoice Value"
                  value={
                    <span className="text-foreground font-semibold">
                      {formatCurrency(placement.totalInvoiceValue || 0)}
                    </span>
                  }
                />
              </DetailSection>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Timeline</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField
                  label="Offer Accepted"
                  value={
                    placement.offerAcceptedDate ? formatDate(placement.offerAcceptedDate) : null
                  }
                />
                <DetailField
                  label="Placement / Joining"
                  value={placement.placementDate ? formatDate(placement.placementDate) : null}
                />
                <DetailField
                  label="Probation Period"
                  value={
                    placement.probationPeriodDays ? `${placement.probationPeriodDays} days` : null
                  }
                />
                <DetailField
                  label="Probation End"
                  value={placement.probationEndDate ? formatDate(placement.probationEndDate) : null}
                />
                <DetailField
                  label="Invoice Date"
                  value={placement.invoiceDate ? formatDate(placement.invoiceDate) : null}
                />
                <DetailField
                  label="Payment Due"
                  value={placement.paymentDueDate ? formatDate(placement.paymentDueDate) : null}
                />
                <DetailField
                  label="Exit Date"
                  value={placement.exitDate ? formatDate(placement.exitDate) : null}
                />
              </DetailSection>
            </CardContent>
          </Card>

          {/* Billing */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Billing &amp; Collection</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField
                  label="Revenue Status"
                  value={<StatusBadge status={placement.revenueStatus} variant="placement" />}
                />
                <DetailField label="Invoice Number" value={placement.invoiceNumber} />
                <DetailField
                  label="Payment Date"
                  value={placement.paymentDate ? formatDate(placement.paymentDate) : null}
                />
                <DetailField
                  label="Amount Received"
                  value={placement.amountReceived ? formatCurrency(placement.amountReceived) : null}
                />
              </DetailSection>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notes */}
      {placement.notes && (
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-foreground text-base font-semibold">Internal Notes</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">{placement.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default async function PlacementDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  return (
    <div className="flex flex-col">
      <Suspense fallback={<PlacementDetailSkeleton />}>
        <PlacementDetailContent id={id} />
      </Suspense>
    </div>
  );
}
