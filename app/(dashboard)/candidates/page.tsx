import {Suspense} from "react";
import {Header} from "@/components/layout/header";
import {CandidatesTable} from "@/components/candidates/candidates-table";
import {StatsCard} from "@/components/dashboard/stats-card";
import {getCandidates} from "@/lib/sanity-queries";
import {Users, UserCheck, Clock, UserX} from "lucide-react";

function CandidatesSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted h-28 rounded-lg" />
        ))}
      </div>
      <div className="bg-muted h-96 rounded-lg" />
    </div>
  );
}

async function CandidatesContent() {
  const candidates = await getCandidates();

  const availableCount = candidates.filter(
    (c) => c.status === "immediately_available" || c.status === "available_next_30_days" || c.status === "available",
  ).length;
  const placedCount = candidates.filter((c) => c.status === "placed").length;
  const onNoticeCount = candidates.filter((c) => c.status === "on_notice_period" || c.status === "in_process").length;

  return (
    <div className="space-y-6 p-6">
      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Candidates" value={candidates.length} icon={Users} />
        <StatsCard title="Available" value={availableCount} icon={UserCheck} variant="success" />
        <StatsCard title="On Notice" value={onNoticeCount} icon={Clock} variant="warning" />
        <StatsCard title="Placed" value={placedCount} icon={UserX} variant="info" />
      </div>

      {/* Candidates Table */}
      <CandidatesTable candidates={candidates} />
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <div className="flex flex-col">
      <Header title="Candidates" subtitle="Manage your talent pool" />
      <Suspense fallback={<CandidatesSkeleton />}>
        <CandidatesContent />
      </Suspense>
    </div>
  );
}
