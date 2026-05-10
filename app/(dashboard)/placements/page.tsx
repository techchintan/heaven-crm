import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { PlacementsTable } from "@/components/placements/placements-table";
import { StatsCard } from "@/components/dashboard/stats-card";
import { getPlacements } from "@/lib/sanity-queries";
import { FileText, IndianRupee, Clock, CheckCircle2 } from "lucide-react";

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

function PlacementsSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-card" />
        ))}
      </div>
      <div className="h-96 rounded-xl bg-card" />
    </div>
  );
}

async function PlacementsContent() {
  const placements = await getPlacements();

  const totalValue = placements.reduce(
    (sum, p) => sum + (p.totalInvoiceValue || 0),
    0
  );
  const paidValue = placements
    .filter((p) => p.revenueStatus === "paid")
    .reduce((sum, p) => sum + (p.amountReceived || p.totalInvoiceValue || 0), 0);
  const pendingValue = placements
    .filter((p) => p.revenueStatus === "pending" || p.revenueStatus === "invoiced")
    .reduce((sum, p) => sum + (p.totalInvoiceValue || 0), 0);

  return (
    <div className="space-y-6 p-6">
      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Placements"
          value={placements.length}
          icon={FileText}
        />
        <StatsCard
          title="Total Value"
          value={formatCurrency(totalValue)}
          icon={IndianRupee}
        />
        <StatsCard
          title="Pending"
          value={formatCurrency(pendingValue)}
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Collected"
          value={formatCurrency(paidValue)}
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Placements Table */}
      <PlacementsTable placements={placements} />
    </div>
  );
}

export default function PlacementsPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Placements"
        subtitle="Manage all candidate placements"
      />
      <Suspense fallback={<PlacementsSkeleton />}>
        <PlacementsContent />
      </Suspense>
    </div>
  );
}
