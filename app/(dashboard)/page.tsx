import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecruiterLeaderboard } from "@/components/dashboard/recruiter-leaderboard";
import { AtRiskPlacements } from "@/components/dashboard/at-risk-placements";
import { RecentPlacements } from "@/components/dashboard/recent-placements";
import { getDashboardStats } from "@/lib/sanity-queries";
import {
  FileText,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Building2,
  UserCog,
} from "lucide-react";

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-card" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-xl bg-card lg:col-span-2" />
        <div className="h-80 rounded-xl bg-card" />
      </div>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6 p-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Placements"
          value={stats.totalPlacements}
          subtitle="All time"
          icon={FileText}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Gross invoice value"
          icon={IndianRupee}
        />
        <StatsCard
          title="Pending Revenue"
          value={formatCurrency(stats.pendingRevenue)}
          subtitle="Awaiting payment"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Collected Revenue"
          value={formatCurrency(stats.paidRevenue)}
          subtitle="Received payments"
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="Deductions"
          value={stats.deductedCount}
          subtitle="Early exits"
          icon={XCircle}
          variant={stats.deductedCount > 0 ? "danger" : "default"}
        />
        <StatsCard
          title="Available Candidates"
          value={stats.activeCandidates}
          subtitle="Ready for placement"
          icon={Users}
          variant="info"
        />
        <StatsCard
          title="Active Clients"
          value={stats.activeClients}
          subtitle="Hiring companies"
          icon={Building2}
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          subtitle="Active recruiters"
          icon={UserCog}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.monthlyRevenue} />
        </div>
        <RecruiterLeaderboard data={stats.recruiterStats} />
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentPlacements placements={stats.recentPlacements} />
        </div>
        <AtRiskPlacements placements={stats.atRiskPlacements} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        subtitle="Overview of your recruitment metrics"
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
