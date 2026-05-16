import {Suspense} from "react";
import {Header} from "@/components/layout/header";
import {ClientsTable} from "@/components/clients/clients-table";
import {StatsCard} from "@/components/dashboard/stats-card";
import {getClients} from "@/lib/sanity-queries";
import {Building2, CheckCircle2, Clock, Loader2, PauseCircle} from "lucide-react";

function ClientsSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card h-28 rounded-xl" />
        ))}
      </div>
      <div className="bg-card h-96 rounded-xl" />
    </div>
  );
}

async function ClientsContent() {
  const clients = await getClients();

  const activeCount = clients.filter((c) => c.status === "active").length;
  const prospectCount = clients.filter((c) => c.status === "prospect").length;
  const inProgressCount = clients.filter((c) => c.status === "in_progress").length;
  const inactiveCount = clients.filter(
    (c) => c.status === "inactive" || c.status === "on_hold",
  ).length;

  return (
    <div className="space-y-6 p-6">
      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Clients" value={clients.length} icon={Building2} />
        <StatsCard title="Active" value={activeCount} icon={CheckCircle2} variant="success" />
        <StatsCard title="Prospects" value={prospectCount} icon={Clock} variant="info" />
        <StatsCard
          title="In Progress"
          value={inProgressCount}
          icon={Loader2}
          variant="warning"
        />
        <StatsCard title="Inactive" value={inactiveCount} icon={PauseCircle} />
      </div>

      {/* Clients Table */}
      <ClientsTable clients={clients} />
    </div>
  );
}

export default function ClientsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Clients" subtitle="Manage your hiring companies" />
      <Suspense fallback={<ClientsSkeleton />}>
        <ClientsContent />
      </Suspense>
    </div>
  );
}
