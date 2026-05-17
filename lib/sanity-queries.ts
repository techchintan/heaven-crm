import {sanityFetch} from "@/sanity/lib/live";

async function fetchQuery<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  const {data} = await sanityFetch({query, params});
  return data as T;
}

// Types
export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  isActive: boolean;
  joinedAt?: string;
}

export interface Candidate {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  primarySkill: string;
  skills?: string[];
  experience?: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: number;
  status:
    | "immediately_available"
    | "available_next_30_days"
    | "on_notice_period"
    | "not_available"
    | "on_hold"
    | "placed"
    | "available"
    | "in_process";
  linkedInUrl?: string;
  location?: string;
  source?: string;
  notes?: string;
  createdAt: string;
}

export interface VendorStateTaxRegistration {
  state: string;
  branchName?: string;
  gstin?: string;
  pan?: string;
  isPrimary?: boolean;
}

export interface Vendor {
  _id: string;
  companyName: string;
  industry?: string;
  stateTaxRegistrations?: VendorStateTaxRegistration[];
  primaryContact?: string;
  contactDesignation?: string;
  contactEmail?: string;
  contactPhone?: string;
  billingEmail?: string;
  billingAddress?: string;
  website?: string;
  agreementFeePercentage?: number;
  paymentTerms?: number;
  status: "active" | "inactive" | "prospect" | "in_progress" | "on_hold";
  notes?: string;
  createdAt: string;
}

export interface Placement {
  _id: string;
  candidate: {
    _id: string;
    fullName: string;
    primarySkill: string;
  };
  vendor: {
    _id: string;
    companyName: string;
  };
  recruiter: {
    _id: string;
    name: string;
  };
  jobTitle: string;
  baseSalary: number;
  feePercentage: number;
  gstPercentage: number;
  feeAmount?: number;
  gstAmount?: number;
  totalInvoiceValue?: number;
  placementDate: string;
  probationEndDate?: string;
  invoiceDate?: string;
  exitDate?: string;
  paymentDueDate?: string;
  revenueStatus: "pending" | "invoiced" | "paid" | "deducted" | "partially_paid";
  invoiceNumber?: string;
  paymentDate?: string;
  amountReceived?: number;
  notes?: string;
  createdAt: string;
}

// Queries
export async function getPlacements(): Promise<Placement[]> {
  return fetchQuery<Placement[]>(`
    *[_type == "placement"] | order(placementDate desc) {
      _id,
      "candidate": candidate->{
        _id,
        fullName,
        primarySkill
      },
      "vendor": vendor->{
        _id,
        companyName
      },
      "recruiter": recruiter->{
        _id,
        name
      },
      jobTitle,
      baseSalary,
      feePercentage,
      gstPercentage,
      feeAmount,
      gstAmount,
      totalInvoiceValue,
      placementDate,
      probationEndDate,
      invoiceDate,
      exitDate,
      paymentDueDate,
      revenueStatus,
      invoiceNumber,
      paymentDate,
      amountReceived,
      notes,
      createdAt
    }
  `);
}

export async function getCandidates(): Promise<Candidate[]> {
  return fetchQuery<Candidate[]>(`
    *[_type == "candidate"] | order(createdAt desc) {
      _id,
      fullName,
      email,
      phone,
      primarySkill,
      skills,
      experience,
      currentSalary,
      expectedSalary,
      noticePeriod,
      status,
      linkedInUrl,
      location,
      source,
      notes,
      createdAt
    }
  `);
}

export async function getVendors(): Promise<Vendor[]> {
  return fetchQuery<Vendor[]>(`
    *[_type == "vendor"] | order(companyName asc) {
      _id,
      companyName,
      industry,
      stateTaxRegistrations[]{
        state,
        branchName,
        gstin,
        pan,
        isPrimary
      },
      "primaryContact": coalesce(
        contacts[isPrimary == true][0].name,
        contacts[0].name
      ),
      "contactDesignation": coalesce(
        contacts[isPrimary == true][0].designation,
        contacts[0].designation
      ),
      "contactEmail": coalesce(
        contacts[isPrimary == true][0].email,
        contacts[0].email
      ),
      "contactPhone": coalesce(
        contacts[isPrimary == true][0].phone,
        contacts[0].phone
      ),
      billingEmail,
      billingAddress,
      website,
      agreementFeePercentage,
      paymentTerms,
      status,
      notes,
      createdAt
    }
  `);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return fetchQuery<TeamMember[]>(`
    *[_type == "teamMember"] | order(name asc) {
      _id,
      name,
      email,
      role,
      phone,
      isActive,
      joinedAt
    }
  `);
}

// Detail Types (extended for detail pages)
export interface CandidateDetail extends Candidate {
  alternateEmail?: string;
  alternatePhone?: string;
  currentCompany?: string;
  currentDesignation?: string;
  currentLocation?: string;
  highestEducation?: string;
  remotePreference?: string;
  willingToRelocate?: boolean;
  preferredLocations?: string[];
  languages?: string[];
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  assignedRecruiter?: {_id: string; name: string};
}

export interface VendorContact {
  name: string;
  designation?: string;
  email: string;
  phone?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export interface VendorDetail extends Vendor {
  legalName?: string;
  contacts?: VendorContact[];
  feeModel?: string;
  msaStartDate?: string;
  msaEndDate?: string;
  leadSource?: string;
}

export interface PlacementDetail extends Omit<Placement, "vendor" | "recruiter"> {
  vendor: {
    _id: string;
    companyName: string;
    industry?: string;
    agreementFeePercentage?: number;
    paymentTerms?: number;
  };
  recruiter: {
    _id: string;
    name: string;
    email?: string;
    role?: string;
  };
  candidate: {
    _id: string;
    fullName: string;
    primarySkill: string;
    email?: string;
    phone?: string;
  };
  engagementType?: string;
  workArrangement?: string;
  workLocation?: string;
  vendorReference?: string;
  offerAcceptedDate?: string;
  probationPeriodDays?: number;
  feeMode?: string;
  flatFeeAmount?: number;
}

export interface TeamMemberDetail extends TeamMember {
  employeeCode?: string;
  legalName?: string;
  alternatePhone?: string;
  specializations?: string[];
  workStatus?: string;
  leftAt?: string;
  salary?: number;
  incentivePercentage?: number;
  residentialAddress?: string;
  notes?: string;
}

// Detail Queries (single records)
export async function getPlacementById(id: string): Promise<PlacementDetail | null> {
  return fetchQuery<PlacementDetail | null>(
    `
    *[_type == "placement" && _id == $id][0] {
      _id,
      "candidate": candidate->{
        _id,
        fullName,
        primarySkill,
        email,
        phone
      },
      "vendor": vendor->{
        _id,
        companyName,
        industry,
        agreementFeePercentage,
        paymentTerms
      },
      "recruiter": recruiter->{
        _id,
        name,
        email,
        role
      },
      jobTitle,
      engagementType,
      workArrangement,
      workLocation,
      vendorReference,
      offerAcceptedDate,
      baseSalary,
      feeMode,
      feePercentage,
      flatFeeAmount,
      gstPercentage,
      feeAmount,
      gstAmount,
      totalInvoiceValue,
      placementDate,
      probationPeriodDays,
      probationEndDate,
      invoiceDate,
      exitDate,
      paymentDueDate,
      revenueStatus,
      invoiceNumber,
      paymentDate,
      amountReceived,
      notes,
      createdAt
    }
  `,
    {id},
  );
}

export async function getCandidateById(id: string): Promise<CandidateDetail | null> {
  return fetchQuery<CandidateDetail | null>(
    `
    *[_type == "candidate" && _id == $id][0] {
      _id,
      fullName,
      email,
      phone,
      alternateEmail,
      alternatePhone,
      primarySkill,
      skills,
      experience,
      currentSalary,
      expectedSalary,
      noticePeriod,
      status,
      currentCompany,
      currentDesignation,
      currentLocation,
      highestEducation,
      remotePreference,
      willingToRelocate,
      preferredLocations,
      languages,
      linkedInUrl,
      location,
      source,
      lastContactedAt,
      nextFollowUpAt,
      "assignedRecruiter": assignedRecruiter->{ _id, name },
      notes,
      createdAt
    }
  `,
    {id},
  );
}

export async function getVendorById(id: string): Promise<VendorDetail | null> {
  return fetchQuery<VendorDetail | null>(
    `
    *[_type == "vendor" && _id == $id][0] {
      _id,
      companyName,
      legalName,
      industry,
      website,
      status,
      stateTaxRegistrations[]{
        state,
        branchName,
        gstin,
        pan,
        isPrimary
      },
      contacts[]{
        name,
        designation,
        email,
        phone,
        isPrimary,
        isActive
      },
      "primaryContact": coalesce(
        contacts[isPrimary == true][0].name,
        contacts[0].name
      ),
      "contactDesignation": coalesce(
        contacts[isPrimary == true][0].designation,
        contacts[0].designation
      ),
      "contactEmail": coalesce(
        contacts[isPrimary == true][0].email,
        contacts[0].email
      ),
      "contactPhone": coalesce(
        contacts[isPrimary == true][0].phone,
        contacts[0].phone
      ),
      billingEmail,
      billingAddress,
      feeModel,
      agreementFeePercentage,
      paymentTerms,
      msaStartDate,
      msaEndDate,
      leadSource,
      notes,
      createdAt
    }
  `,
    {id},
  );
}

export async function getTeamMemberById(id: string): Promise<TeamMemberDetail | null> {
  return fetchQuery<TeamMemberDetail | null>(
    `
    *[_type == "teamMember" && _id == $id][0] {
      _id,
      employeeCode,
      name,
      legalName,
      email,
      phone,
      alternatePhone,
      role,
      specializations,
      isActive,
      workStatus,
      joinedAt,
      leftAt,
      salary,
      incentivePercentage,
      residentialAddress,
      notes
    }
  `,
    {id},
  );
}

export async function getPlacementsByCandidate(candidateId: string): Promise<Placement[]> {
  return fetchQuery<Placement[]>(
    `
    *[_type == "placement" && candidate._ref == $candidateId] | order(placementDate desc) {
      _id,
      "candidate": candidate->{ _id, fullName, primarySkill },
      "vendor": vendor->{ _id, companyName },
      "recruiter": recruiter->{ _id, name },
      jobTitle,
      baseSalary,
      feePercentage,
      gstPercentage,
      feeAmount,
      gstAmount,
      totalInvoiceValue,
      placementDate,
      probationEndDate,
      exitDate,
      paymentDueDate,
      revenueStatus,
      invoiceNumber,
      paymentDate,
      amountReceived,
      notes,
      createdAt
    }
  `,
    {candidateId},
  );
}

export async function getPlacementsByVendor(vendorId: string): Promise<Placement[]> {
  return fetchQuery<Placement[]>(
    `
    *[_type == "placement" && vendor._ref == $vendorId] | order(placementDate desc) {
      _id,
      "candidate": candidate->{ _id, fullName, primarySkill },
      "vendor": vendor->{ _id, companyName },
      "recruiter": recruiter->{ _id, name },
      jobTitle,
      baseSalary,
      feePercentage,
      gstPercentage,
      feeAmount,
      gstAmount,
      totalInvoiceValue,
      placementDate,
      probationEndDate,
      exitDate,
      paymentDueDate,
      revenueStatus,
      invoiceNumber,
      paymentDate,
      amountReceived,
      notes,
      createdAt
    }
  `,
    {vendorId},
  );
}

export async function getPlacementsByRecruiter(recruiterId: string): Promise<Placement[]> {
  return fetchQuery<Placement[]>(
    `
    *[_type == "placement" && recruiter._ref == $recruiterId] | order(placementDate desc) {
      _id,
      "candidate": candidate->{ _id, fullName, primarySkill },
      "vendor": vendor->{ _id, companyName },
      "recruiter": recruiter->{ _id, name },
      jobTitle,
      baseSalary,
      feePercentage,
      gstPercentage,
      feeAmount,
      gstAmount,
      totalInvoiceValue,
      placementDate,
      probationEndDate,
      exitDate,
      paymentDueDate,
      revenueStatus,
      invoiceNumber,
      paymentDate,
      amountReceived,
      notes,
      createdAt
    }
  `,
    {recruiterId},
  );
}

// Dashboard Analytics
export interface DashboardStats {
  totalPlacements: number;
  totalRevenue: number;
  pendingRevenue: number;
  paidRevenue: number;
  deductedCount: number;
  activeCandidates: number;
  activeVendors: number;
  teamMembers: number;
  recentPlacements: Placement[];
  atRiskPlacements: Placement[];
  recruiterStats: {
    name: string;
    placements: number;
    revenue: number;
  }[];
  monthlyRevenue: {
    month: string;
    actual: number;
    projected: number;
  }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [placements, candidates, vendors, teamMembers] = await Promise.all([
    getPlacements(),
    getCandidates(),
    getVendors(),
    getTeamMembers(),
  ]);

  // Calculate totals
  const totalRevenue = placements.reduce((sum, p) => sum + (p.totalInvoiceValue || 0), 0);
  const paidRevenue = placements
    .filter((p) => p.revenueStatus === "paid")
    .reduce((sum, p) => sum + (p.amountReceived || p.totalInvoiceValue || 0), 0);
  const pendingRevenue = placements
    .filter((p) => p.revenueStatus === "pending" || p.revenueStatus === "invoiced")
    .reduce((sum, p) => sum + (p.totalInvoiceValue || 0), 0);
  const deductedCount = placements.filter((p) => p.revenueStatus === "deducted").length;

  // At-risk placements (within probation period and not yet paid)
  const today = new Date();
  const atRiskPlacements = placements.filter((p) => {
    if (p.revenueStatus === "paid" || p.revenueStatus === "deducted") return false;
    if (!p.probationEndDate) return false;
    const probEnd = new Date(p.probationEndDate);
    return probEnd > today && probEnd < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  });

  // Recruiter stats
  const recruiterMap = new Map<string, {name: string; placements: number; revenue: number}>();
  placements.forEach((p) => {
    if (!p.recruiter) return;
    const existing = recruiterMap.get(p.recruiter._id) || {
      name: p.recruiter.name,
      placements: 0,
      revenue: 0,
    };
    existing.placements += 1;
    existing.revenue += p.totalInvoiceValue || 0;
    recruiterMap.set(p.recruiter._id, existing);
  });

  // Monthly revenue (last 6 months)
  const monthlyRevenue: {month: string; actual: number; projected: number}[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toLocaleDateString("en-US", {month: "short", year: "2-digit"});
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const monthPlacements = placements.filter((p) => {
      const pDate = new Date(p.placementDate);
      return pDate >= monthStart && pDate <= monthEnd;
    });

    const actual = monthPlacements
      .filter((p) => p.revenueStatus === "paid")
      .reduce((sum, p) => sum + (p.amountReceived || p.totalInvoiceValue || 0), 0);
    const projected = monthPlacements.reduce((sum, p) => sum + (p.totalInvoiceValue || 0), 0);

    monthlyRevenue.push({month: monthStr, actual, projected});
  }

  return {
    totalPlacements: placements.length,
    totalRevenue,
    pendingRevenue,
    paidRevenue,
    deductedCount,
    activeCandidates: candidates.filter(
      (c) =>
        c.status === "immediately_available" ||
        c.status === "available_next_30_days" ||
        c.status === "available",
    ).length,
    activeVendors: vendors.filter((v) => v.status === "active").length,
    teamMembers: teamMembers.filter((t) => t.isActive).length,
    recentPlacements: placements.slice(0, 5),
    atRiskPlacements,
    recruiterStats: Array.from(recruiterMap.values()).sort((a, b) => b.revenue - a.revenue),
    monthlyRevenue,
  };
}
