import type {PlacementsQueryResult} from "@/sanity.types";
import {getCandidates, getPlacements, getTeamMembers, getVendors} from "@/sanity/lib/fetch";

export interface DashboardStats {
  totalPlacements: number;
  totalRevenue: number;
  pendingRevenue: number;
  paidRevenue: number;
  deductedCount: number;
  activeCandidates: number;
  activeVendors: number;
  teamMembers: number;
  recentPlacements: PlacementsQueryResult;
  atRiskPlacements: PlacementsQueryResult;
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

  const totalRevenue = placements.reduce((sum, p) => sum + (p.totalInvoiceValue || 0), 0);
  const paidRevenue = placements
    .filter((p) => p.revenueStatus === "paid")
    .reduce((sum, p) => sum + (p.amountReceived || p.totalInvoiceValue || 0), 0);
  const pendingRevenue = placements
    .filter((p) => p.revenueStatus === "pending" || p.revenueStatus === "invoiced")
    .reduce((sum, p) => sum + (p.totalInvoiceValue || 0), 0);
  const deductedCount = placements.filter((p) => p.revenueStatus === "deducted").length;

  const today = new Date();
  const atRiskPlacements = placements.filter((p) => {
    if (p.revenueStatus === "paid" || p.revenueStatus === "deducted") return false;
    if (!p.probationEndDate) return false;
    const probEnd = new Date(p.probationEndDate);
    return probEnd > today && probEnd < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  });

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
      (c) => c.status === "immediately_available" || c.status === "available_next_30_days",
    ).length,
    activeVendors: vendors.filter((v) => v.status === "active").length,
    teamMembers: teamMembers.filter((t) => t.isActive).length,
    recentPlacements: placements.slice(0, 5),
    atRiskPlacements,
    recruiterStats: Array.from(recruiterMap.values()).sort((a, b) => b.revenue - a.revenue),
    monthlyRevenue,
  };
}
