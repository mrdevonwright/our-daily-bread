import { formatCurrency, formatNumber } from "@/lib/utils";
import { Wheat, DollarSign, Calendar, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  loavesSold: number;
  moneyRaised: number;
  recentLoaves?: number;
  recentMoney?: number;
}

export function StatsCards({
  loavesSold,
  moneyRaised,
  recentLoaves = 0,
  recentMoney = 0,
}: StatsCardsProps) {
  const stats = [
    {
      icon: Wheat,
      label: "Total Loaves Sold",
      value: formatNumber(loavesSold),
      sub: `+${recentLoaves} this month`,
    },
    {
      icon: DollarSign,
      label: "Total Money Raised",
      value: formatCurrency(moneyRaised),
      sub: `+${formatCurrency(recentMoney)} this month`,
    },
    {
      icon: Calendar,
      label: "Avg per Sunday",
      value:
        loavesSold > 0
          ? formatNumber(Math.round(loavesSold / Math.max(1, Math.ceil(loavesSold / 5))))
          : "0",
      sub: "loaves",
    },
    {
      icon: TrendingUp,
      label: "Avg per Loaf",
      value:
        loavesSold > 0
          ? formatCurrency(moneyRaised / loavesSold)
          : "$0",
      sub: "price per loaf",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-wheat/15 shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-wheat/10 flex items-center justify-center mb-3">
              <Icon className="w-4 h-4 text-wheat" />
            </div>
            <div className="font-serif text-2xl font-bold text-foreground mb-0.5">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="text-xs text-wheat/80 mt-1">{stat.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
