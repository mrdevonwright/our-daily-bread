"use client";

import { useState } from "react";
import { Wheat, DollarSign, Calendar, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { formatCurrency, formatNumber } from "@/lib/utils";

type Metric = "loaves" | "money" | "avgSunday" | "avgPerLoaf";

interface Sale {
  loaves_count: number;
  amount_raised: number;
  sold_at: string;
}

interface StatsSectionProps {
  loavesSold: number;
  moneyRaised: number;
  salesCount: number;
  chartSales: Sale[];
}

// ── Chart data transform ─────────────────────────────────────────────────────

function buildChartData(sales: Sale[], metric: Metric) {
  // Sort ascending for cumulative calcs
  const sorted = [...sales].sort((a, b) =>
    a.sold_at < b.sold_at ? -1 : 1
  );

  let cumulativeLoaves = 0;
  let cumulativeMoney = 0;

  return sorted.map((s) => {
    cumulativeLoaves += s.loaves_count;
    cumulativeMoney += Number(s.amount_raised);
    const avgPerLoaf =
      s.loaves_count > 0 ? Number(s.amount_raised) / s.loaves_count : 0;

    let value: number;
    switch (metric) {
      case "loaves":
        value = cumulativeLoaves;
        break;
      case "money":
        value = cumulativeMoney;
        break;
      case "avgSunday":
        value = s.loaves_count;
        break;
      case "avgPerLoaf":
        value = avgPerLoaf;
        break;
    }

    return {
      date: format(parseISO(s.sold_at), "MMM d"),
      value,
    };
  });
}

// ── Custom tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  metric: Metric;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const formatted =
    metric === "money" || metric === "avgPerLoaf"
      ? formatCurrency(val)
      : `${formatNumber(Math.round(val))} loaves`;

  return (
    <div className="bg-white border border-wheat/20 rounded-xl px-3 py-2 shadow-md text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground mt-0.5">{formatted}</p>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function StatsSection({
  loavesSold,
  moneyRaised,
  salesCount,
  chartSales,
}: StatsSectionProps) {
  const [activeMetric, setActiveMetric] = useState<Metric>("money");

  const avgPerSunday =
    loavesSold > 0 && salesCount > 0
      ? Math.round(loavesSold / salesCount)
      : 0;
  const avgPerLoaf =
    loavesSold > 0 ? moneyRaised / loavesSold : 0;

  const stats: { id: Metric; icon: typeof Wheat; label: string; value: string; sub: string }[] = [
    {
      id: "loaves",
      icon: Wheat,
      label: "Total Loaves Sold",
      value: formatNumber(loavesSold),
      sub: `across ${salesCount} Sunday${salesCount !== 1 ? "s" : ""}`,
    },
    {
      id: "money",
      icon: DollarSign,
      label: "Total Money Raised",
      value: formatCurrency(moneyRaised),
      sub: "for the congregation",
    },
    {
      id: "avgSunday",
      icon: Calendar,
      label: "Avg per Sunday",
      value: formatNumber(avgPerSunday),
      sub: "loaves per week",
    },
    {
      id: "avgPerLoaf",
      icon: TrendingUp,
      label: "Avg per Loaf",
      value: formatCurrency(avgPerLoaf),
      sub: "price per loaf",
    },
  ];

  const chartData = buildChartData(chartSales, activeMetric);
  const hasData = chartData.length >= 2;

  const activeLabel = stats.find((s) => s.id === activeMetric)?.label ?? "";

  const yFormatter = (v: number) =>
    activeMetric === "money" || activeMetric === "avgPerLoaf"
      ? `$${Math.round(v)}`
      : String(Math.round(v));

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isActive = activeMetric === stat.id;
          return (
            <button
              key={stat.id}
              onClick={() => setActiveMetric(stat.id)}
              className={`text-left bg-white rounded-2xl p-5 border shadow-sm transition-all ${
                isActive
                  ? "border-wheat ring-1 ring-wheat/30"
                  : "border-wheat/15 hover:border-wheat/40"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  isActive ? "bg-wheat/20" : "bg-wheat/10"
                }`}
              >
                <Icon className="w-4 h-4 text-wheat" />
              </div>
              <div className="font-serif text-2xl font-bold text-foreground mb-0.5">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-wheat/80 mt-1">{stat.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-2xl border border-wheat/15 shadow-sm px-6 pt-5 pb-4">
        <p className="text-sm font-medium text-foreground mb-4">
          {activeLabel}
          <span className="text-muted-foreground font-normal ml-1.5">over time</span>
        </p>

        {!hasData ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {chartSales.length === 0
                ? "Log your first sale to see your trend here."
                : "Log one more sale to start seeing your trend."}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="wheatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8973A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#C8973A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F0E4CC"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9E7A50" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={yFormatter}
                tick={{ fontSize: 11, fill: "#9E7A50" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                content={<ChartTooltip metric={activeMetric} />}
                cursor={{ stroke: "#C8973A", strokeWidth: 1, strokeDasharray: "4 2" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#C8973A"
                strokeWidth={2}
                fill="url(#wheatGradient)"
                dot={chartData.length <= 8 ? { fill: "#C8973A", r: 3, strokeWidth: 0 } : false}
                activeDot={{ fill: "#C8973A", r: 4, strokeWidth: 2, stroke: "#fff" }}
                animationDuration={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
