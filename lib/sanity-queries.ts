import {client} from "@/sanity/lib/client";

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
  status: "available" | "placed" | "in_process" | "on_hold" | "not_available";
  linkedInUrl?: string;
  location?: string;
  source?: string;
  notes?: string;
  createdAt: string;
}

export interface Client {
  _id: string;
  companyName: string;
  industry?: string;
  gstin?: string;
  pan?: string;
  primaryContact: string;
  contactDesignation?: string;
  contactEmail: string;
  contactPhone?: string;
  billingEmail?: string;
  billingAddress?: string;
  website?: string;
  agreementFeePercentage?: number;
  paymentTerms?: number;
  status: "active" | "inactive" | "prospect" | "on_hold";
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
  client: {
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
  return client.fetch(`
    *[_type == "placement"] | order(placementDate desc) {
      _id,
      "candidate": candidate->{
        _id,
        fullName,
        primarySkill
      },
      "client": client->{
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
  return client.fetch(`
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

export async function getClients(): Promise<Client[]> {
  return client.fetch(`
    *[_type == "client"] | order(companyName asc) {
      _id,
      companyName,
      industry,
      gstin,
      pan,
      primaryContact,
      contactDesignation,
      contactEmail,
      contactPhone,
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
  return client.fetch(`
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

// Dashboard Analytics
export interface DashboardStats {
  totalPlacements: number;
  totalRevenue: number;
  pendingRevenue: number;
  paidRevenue: number;
  deductedCount: number;
  activeCandidates: number;
  activeClients: number;
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
  const [placements, candidates, clients, teamMembers] = await Promise.all([
    getPlacements(),
    getCandidates(),
    getClients(),
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
    activeCandidates: candidates.filter((c) => c.status === "available").length,
    activeClients: clients.filter((c) => c.status === "active").length,
    teamMembers: teamMembers.filter((t) => t.isActive).length,
    recentPlacements: placements.slice(0, 5),
    atRiskPlacements,
    recruiterStats: Array.from(recruiterMap.values()).sort((a, b) => b.revenue - a.revenue),
    monthlyRevenue,
  };
}
