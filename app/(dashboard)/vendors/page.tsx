import {Suspense} from "react";
import {Header} from "@/components/layout/header";
import {VendorsTable} from "@/components/vendors/vendors-table";
import {StatsCard} from "@/components/dashboard/stats-card";
import {getVendors} from "@/lib/sanity-queries";
import {Building2, CheckCircle2, Clock, Loader2, PauseCircle} from "lucide-react";

function VendorsSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-muted h-28 rounded-lg" />
        ))}
      </div>
      <div className="bg-muted h-96 rounded-lg" />
    </div>
  );
}

async function VendorsContent() {
  const vendors = await getVendors();

  const activeCount = vendors.filter((v) => v.status === "active").length;
  const prospectCount = vendors.filter((v) => v.status === "prospect").length;
  const inProgressCount = vendors.filter((v) => v.status === "in_progress").length;
  const inactiveCount = vendors.filter(
    (v) => v.status === "inactive" || v.status === "on_hold",
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Vendors" value={vendors.length} icon={Building2} />
        <StatsCard title="Active" value={activeCount} icon={CheckCircle2} variant="success" />
        <StatsCard title="Prospects" value={prospectCount} icon={Clock} variant="info" />
        <StatsCard title="In Progress" value={inProgressCount} icon={Loader2} variant="warning" />
        <StatsCard title="Inactive" value={inactiveCount} icon={PauseCircle} />
      </div>

      <VendorsTable vendors={vendors} />
    </div>
  );
}

export default function VendorsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Vendors" subtitle="Manage your hiring companies" />
      <Suspense fallback={<VendorsSkeleton />}>
        <VendorsContent />
      </Suspense>
    </div>
  );
}
