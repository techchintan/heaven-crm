"use client";

import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

interface RevenueChartProps {
  data: {
    month: string;
    actual: number;
    projected: number;
  }[];
}

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}

export function RevenueChart({data}: RevenueChartProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-foreground text-sm font-medium">Revenue Overview</h3>
          <p className="text-muted-foreground text-xs">Actual vs Projected (Last 6 months)</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="bg-primary h-2.5 w-2.5 rounded-full" />
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-info h-2.5 w-2.5 rounded-full" />
            <span className="text-muted-foreground">Projected</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{fill: "#a1a1aa", fontSize: 12}}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{fill: "#a1a1aa", fontSize: 12}}
              tickFormatter={formatCurrency}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#171717",
                border: "1px solid #262626",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{color: "#fafafa", fontWeight: 500, marginBottom: 4}}
              itemStyle={{color: "#a1a1aa"}}
              formatter={(value) => [`₹${value?.toLocaleString("en-IN")}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#projectedGradient)"
              name="Projected"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#14b8a6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#actualGradient)"
              name="Actual"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
