"use client";

import {Trophy} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

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
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Trophy className="h-4 w-4 text-warning" />
        <CardTitle className="text-sm font-semibold">Recruiter Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No placement data available
          </p>
        ) : (
          <div className="space-y-4">
            {data.map((recruiter, index) => (
              <div key={recruiter.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{recruiter.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {recruiter.placements} placement{recruiter.placements !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(recruiter.revenue)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{width: `${(recruiter.revenue / maxRevenue) * 100}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
