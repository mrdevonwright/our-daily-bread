"use client";

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

interface Sale {
  loaves_count: number;
  amount_raised: number;
  sold_at: string;
}

function buildData(sales: Sale[]) {
  const sorted = [...sales].sort((a, b) => (a.sold_at < b.sold_at ? -1 : 1));
  let cumulative = 0;
  return sorted.map((s) => {
    cumulative += Number(s.amount_raised);
    return {
      date: format(parseISO(s.sold_at), "MMM d"),
      value: cumulative,
    };
  });
}

function TooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-wheat/20 rounded-xl px-3 py-2 shadow-md text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground mt-0.5">
        ${payload[0].value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} raised
      </p>
    </div>
  );
}

export function ChurchTrendChart({ sales }: { sales: Sale[] }) {
  const data = buildData(sales);

  if (data.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
        More Sundays needed to show the trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="churchGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C8973A" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#C8973A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0E4CC" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#9E7A50" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => `$${Math.round(v)}`}
          tick={{ fontSize: 11, fill: "#9E7A50" }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<TooltipContent />} cursor={{ stroke: "#C8973A", strokeWidth: 1, strokeDasharray: "4 2" }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#C8973A"
          strokeWidth={2}
          fill="url(#churchGradient)"
          dot={data.length <= 8 ? { fill: "#C8973A", r: 3, strokeWidth: 0 } : false}
          activeDot={{ fill: "#C8973A", r: 4, strokeWidth: 2, stroke: "#fff" }}
          animationDuration={400}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
