import {Suspense} from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, ExternalLink, Mail, Phone, Link2, MapPin} from "lucide-react";
import {getCandidateById, getPlacementsByCandidate} from "@/sanity/lib/fetch";
import {formatCurrency, formatDate, formatDateTime, formatStatus} from "@/lib/format";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {StatusBadge} from "@/components/ui/status-badge";
import {DetailSection, DetailField} from "@/components/ui/detail-section";
import {Separator} from "@/components/ui/separator";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

function CandidateDetailSkeleton() {
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

const sourceLabels: Record<string, string> = {
  linkedin: "LinkedIn",
  naukri: "Naukri",
  referral: "Referral",
  job_portal: "Job Portal",
  direct: "Direct Application",
  other: "Other",
};

const workModeLabels: Record<string, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
  flexible: "Flexible",
};

async function CandidateDetailContent({id}: {id: string}) {
  const [candidate, placements] = await Promise.all([
    getCandidateById(id),
    getPlacementsByCandidate(id),
  ]);

  if (!candidate) {
    notFound();
  }

  const initials = candidate.fullName
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
            href="/candidates"
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold">
            {initials}
          </div>
          <div>
            <h1 className="text-foreground text-xl font-semibold tracking-tight">
              {candidate.fullName}
            </h1>
            <p className="text-muted-foreground text-sm">
              {candidate.primarySkill}
              {candidate.experience ? ` \u00b7 ${candidate.experience} yrs exp` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={candidate.status} variant="candidate" />
          <a
            href={`/studio/structure/candidate;${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium shadow-sm transition-colors"
          >
            Edit in Studio
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Quick contact bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          {candidate.email && (
            <a
              href={`mailto:${candidate.email}`}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Mail className="h-4 w-4" />
              {candidate.email}
            </a>
          )}
          {candidate.phone && (
            <a
              href={`tel:${candidate.phone}`}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Phone className="h-4 w-4" />
              {candidate.phone}
            </a>
          )}
          {candidate.currentLocation && (
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              {candidate.currentLocation}
            </span>
          )}
          {candidate.linkedInUrl && (
            <a
              href={candidate.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Link2 className="h-4 w-4" />
              LinkedIn
            </a>
          )}
        </CardContent>
      </Card>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          {/* Professional Profile */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Professional Profile</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <DetailSection title="">
                <DetailField label="Primary Skill" value={candidate.primarySkill} />
                <DetailField
                  label="Experience"
                  value={candidate.experience ? `${candidate.experience} years` : null}
                />
                <DetailField label="Highest Education" value={candidate.highestEducation} />
                <DetailField label="Current Company" value={candidate.currentCompany} />
                <DetailField label="Current Designation" value={candidate.currentDesignation} />
                <DetailField label="Current Location" value={candidate.currentLocation} />
              </DetailSection>
              {candidate.skills && candidate.skills.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wider uppercase">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Compensation &amp; Notice</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField
                  label="Current Salary (p.a.)"
                  value={candidate.currentSalary ? formatCurrency(candidate.currentSalary) : null}
                />
                <DetailField
                  label="Expected Salary (p.a.)"
                  value={candidate.expectedSalary ? formatCurrency(candidate.expectedSalary) : null}
                />
                <DetailField
                  label="Notice Period"
                  value={candidate.noticePeriod ? `${candidate.noticePeriod} days` : null}
                />
              </DetailSection>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Contact */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Contact Details</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField label="Email" value={candidate.email} />
                <DetailField label="Phone" value={candidate.phone} />
                <DetailField label="Alternate Email" value={candidate.alternateEmail} />
                <DetailField label="Alternate Phone" value={candidate.alternatePhone} />
              </DetailSection>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">
                Preferences &amp; Sourcing
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <DetailSection title="">
                <DetailField
                  label="Work Mode"
                  value={
                    candidate.remotePreference
                      ? workModeLabels[candidate.remotePreference] ||
                        formatStatus(candidate.remotePreference)
                      : null
                  }
                />
                <DetailField
                  label="Willing to Relocate"
                  value={
                    candidate.willingToRelocate
                      ? "Yes"
                      : candidate.willingToRelocate === false
                        ? "No"
                        : null
                  }
                />
                <DetailField
                  label="Source"
                  value={
                    candidate.source
                      ? sourceLabels[candidate.source] || formatStatus(candidate.source)
                      : null
                  }
                />
              </DetailSection>
              {candidate.preferredLocations && candidate.preferredLocations.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wider uppercase">
                      Preferred Locations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.preferredLocations.map((loc) => (
                        <Badge key={loc} variant="outline">
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {candidate.languages && candidate.languages.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wider uppercase">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.languages.map((lang) => (
                        <Badge key={lang} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pipeline */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Pipeline Info</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField
                  label="Assigned Recruiter"
                  value={
                    candidate.assignedRecruiter ? (
                      <Link
                        href={`/team/${candidate.assignedRecruiter._id}`}
                        className="text-primary hover:underline"
                      >
                        {candidate.assignedRecruiter.name}
                      </Link>
                    ) : null
                  }
                />
                <DetailField
                  label="Last Contacted"
                  value={
                    candidate.lastContactedAt ? formatDateTime(candidate.lastContactedAt) : null
                  }
                />
                <DetailField
                  label="Next Follow-up"
                  value={candidate.nextFollowUpAt ? formatDateTime(candidate.nextFollowUpAt) : null}
                />
                <DetailField
                  label="Added On"
                  value={candidate.createdAt ? formatDate(candidate.createdAt) : null}
                />
              </DetailSection>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notes */}
      {candidate.notes && (
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-foreground text-base font-semibold">Internal Notes</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">{candidate.notes}</p>
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
                  <TableHead>Job Title</TableHead>
                  <TableHead>Vendor</TableHead>
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
                        {p.jobTitle}
                      </Link>
                    </TableCell>
                    <TableCell>{p.vendor?.companyName || "--"}</TableCell>
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

export default async function CandidateDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  return (
    <div className="flex flex-col">
      <Suspense fallback={<CandidateDetailSkeleton />}>
        <CandidateDetailContent id={id} />
      </Suspense>
    </div>
  );
}
