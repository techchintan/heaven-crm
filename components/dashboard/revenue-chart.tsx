"use client";

import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">Revenue Overview</CardTitle>
          <CardDescription className="text-xs">Actual vs Projected (Last 6 months)</CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-info" />
            <span className="text-muted-foreground">Projected</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height={256} debounce={50}>
            <AreaChart data={data} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.35 0.01 260)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.35 0.01 260)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.15 240)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.15 240)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0 0)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{fill: "oklch(0.45 0 0)", fontSize: 12}}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{fill: "oklch(0.45 0 0)", fontSize: 12}}
                tickFormatter={formatCurrency}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.90 0 0)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{color: "oklch(0.145 0 0)", fontWeight: 600, marginBottom: 4}}
                itemStyle={{color: "oklch(0.45 0 0)"}}
                formatter={(value) => [`₹${value?.toLocaleString("en-IN")}`, ""]}
              />
              <Area
                type="monotone"
                dataKey="projected"
                stroke="oklch(0.55 0.15 240)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#projectedGradient)"
                name="Projected"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="oklch(0.35 0.01 260)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#actualGradient)"
                name="Actual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
