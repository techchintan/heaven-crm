"use client";

import {Trophy} from "lucide-react";

interface RecruiterLeaderboardProps {
  data: {
    name: string;
    placements: number;
    revenue: number;
  }[];
}

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export function RecruiterLeaderboard({data}: RecruiterLeaderboardProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="border-border bg-card rounded-xl border p-5">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="text-warning h-4 w-4" />
        <h3 className="text-foreground text-sm font-medium">Recruiter Leaderboard</h3>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No placement data available
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((recruiter, index) => (
            <div key={recruiter.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">{recruiter.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {recruiter.placements} placement{recruiter.placements !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span className="text-foreground text-sm font-semibold">
                  {formatCurrency(recruiter.revenue)}
                </span>
              </div>
              <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{width: `${(recruiter.revenue / maxRevenue) * 100}%`}}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
