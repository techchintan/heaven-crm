import {Suspense} from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, ExternalLink, Mail, Phone} from "lucide-react";
import {getTeamMemberById, getPlacementsByRecruiter} from "@/lib/sanity-queries";
import {formatCurrency, formatDate, formatStatus} from "@/lib/format";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {StatusBadge} from "@/components/ui/status-badge";
import {DetailSection, DetailField} from "@/components/ui/detail-section";
import {Separator} from "@/components/ui/separator";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

function TeamDetailSkeleton() {
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

const roleLabels: Record<string, string> = {
  trainee: "Trainee",
  recruiter: "Recruiter",
  senior_recruiter: "Senior Recruiter",
  team_lead: "Team Lead",
  manager: "Manager",
  founder_ceo: "Founder & CEO",
};

const workStatusLabels: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  intern: "Intern",
};

async function TeamDetailContent({id}: {id: string}) {
  const [member, placements] = await Promise.all([
    getTeamMemberById(id),
    getPlacementsByRecruiter(id),
  ]);

  if (!member) {
    notFound();
  }

  const totalRevenue = placements.reduce((sum, p) => sum + (p.totalInvoiceValue || 0), 0);
  const paidRevenue = placements
    .filter((p) => p.revenueStatus === "paid")
    .reduce((sum, p) => sum + (p.amountReceived || p.totalInvoiceValue || 0), 0);

  const initials = member.name
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
            href="/team"
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold">
            {initials}
          </div>
          <div>
            <h1 className="text-foreground text-xl font-semibold tracking-tight">
              {member.name}
              {member.employeeCode && (
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  ({member.employeeCode})
                </span>
              )}
            </h1>
            <p className="text-muted-foreground text-sm">
              {member.role ? roleLabels[member.role] || formatStatus(member.role) : "Team Member"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={member.isActive ? "success" : "secondary"}>
            {member.isActive ? "Active" : "Inactive"}
          </Badge>
          <a
            href={`/studio/structure/teamMember;${id}`}
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
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-muted-foreground text-sm">Placements</p>
            <p className="text-foreground mt-1 text-2xl font-semibold">{placements.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-muted-foreground text-sm">Total Revenue</p>
            <p className="text-foreground mt-1 text-2xl font-semibold">
              {formatCurrency(totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-muted-foreground text-sm">Collected</p>
            <p className="text-foreground mt-1 text-2xl font-semibold">
              {formatCurrency(paidRevenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Profile</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField label="Display Name" value={member.name} />
                <DetailField label="Legal Name" value={member.legalName} />
                <DetailField label="Employee Code" value={member.employeeCode} />
                <DetailField
                  label="Role"
                  value={member.role ? roleLabels[member.role] || formatStatus(member.role) : null}
                />
                <DetailField label="Email" value={member.email} />
                <DetailField label="Phone" value={member.phone} />
                <DetailField label="Alternate Phone" value={member.alternatePhone} />
              </DetailSection>
              {member.specializations && member.specializations.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wider uppercase">
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {member.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact actions */}
          <Card>
            <CardContent className="flex flex-wrap items-center gap-3 p-4">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Employment */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Employment</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField label="Status" value={member.isActive ? "Active" : "Inactive"} />
                <DetailField
                  label="Work Status"
                  value={
                    member.workStatus
                      ? workStatusLabels[member.workStatus] || formatStatus(member.workStatus)
                      : null
                  }
                />
                <DetailField
                  label="Joined"
                  value={member.joinedAt ? formatDate(member.joinedAt) : null}
                />
                <DetailField
                  label="Left"
                  value={member.leftAt ? formatDate(member.leftAt) : null}
                />
              </DetailSection>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-base font-semibold">Compensation</h2>
            </CardHeader>
            <CardContent>
              <DetailSection title="">
                <DetailField
                  label="Annual Salary"
                  value={member.salary ? formatCurrency(member.salary) : null}
                />
                <DetailField
                  label="Incentive %"
                  value={
                    member.incentivePercentage != null ? `${member.incentivePercentage}%` : null
                  }
                />
              </DetailSection>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notes */}
      {member.notes && (
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-foreground text-base font-semibold">Internal Notes</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">{member.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Placement History */}
      {placements.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-foreground text-base font-semibold">
              Placements ({placements.length})
            </h2>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Vendor</TableHead>
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
                      {p.vendor?.companyName || "--"}
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

export default async function TeamDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  return (
    <div className="flex flex-col">
      <Suspense fallback={<TeamDetailSkeleton />}>
        <TeamDetailContent id={id} />
      </Suspense>
    </div>
  );
}
