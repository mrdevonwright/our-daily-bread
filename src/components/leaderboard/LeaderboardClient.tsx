"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Trophy, Wheat, Users, Heart, Flame, ChevronRight } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export interface ChurchStats {
  id: string;
  name: string;
  city: string;
  state: string;
  denomination: string | null;
  created_at: string;
  totalLoaves: number;
  totalRaised: number;
  bakerCount: number;
  avgPerLoaf: number;
  lastSaleDate: string | null;
  recentSalesCount: number;
  salesCount: number;
}

type SortKey = "raised" | "loaves" | "bakers" | "generous" | "recent";

const SORT_TABS: { id: SortKey; label: string; icon: React.ReactNode }[] = [
  { id: "raised", label: "Most Raised", icon: <Trophy className="w-3.5 h-3.5" /> },
  { id: "loaves", label: "Most Loaves", icon: <Wheat className="w-3.5 h-3.5" /> },
  { id: "bakers", label: "Biggest Team", icon: <Users className="w-3.5 h-3.5" /> },
  { id: "generous", label: "Most Generous", icon: <Heart className="w-3.5 h-3.5" /> },
  { id: "recent", label: "On a Roll 🔥", icon: <Flame className="w-3.5 h-3.5" /> },
];

function sortChurches(churches: ChurchStats[], key: SortKey): ChurchStats[] {
  return [...churches].sort((a, b) => {
    switch (key) {
      case "raised":   return b.totalRaised - a.totalRaised;
      case "loaves":   return b.totalLoaves - a.totalLoaves;
      case "bakers":   return b.bakerCount - a.bakerCount;
      case "generous": return b.avgPerLoaf - a.avgPerLoaf;
      case "recent":   return b.recentSalesCount - a.recentSalesCount;
    }
  });
}

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardClient({ churches }: { churches: ChurchStats[] }) {
  const [sortBy, setSortBy] = useState<SortKey>("raised");
  const [stateFilter, setStateFilter] = useState("all");

  const uniqueStates = useMemo(() => {
    const states = Array.from(new Set(churches.map((c) => c.state))).sort();
    return states;
  }, [churches]);

  const filtered = useMemo(() => {
    const base = stateFilter === "all" ? churches : churches.filter((c) => c.state === stateFilter);
    return sortChurches(base, sortBy);
  }, [churches, sortBy, stateFilter]);

  // Spotlights always from full, unfiltered dataset
  const byRaised   = sortChurches(churches, "raised")[0];
  const byLoaves   = sortChurches(churches, "loaves")[0];
  const byGenerous = sortChurches(churches.filter((c) => c.salesCount > 0), "generous")[0];
  const byRecent   = sortChurches(churches, "recent")[0];

  const spotlights = [
    byRaised   && { icon: "🏆", label: "Top Fundraiser",   church: byRaised,   stat: formatCurrency(byRaised.totalRaised),   sub: "raised for the kingdom" },
    byLoaves   && { icon: "🍞", label: "Most Loaves Baked", church: byLoaves,   stat: `${formatNumber(byLoaves.totalLoaves)} loaves`, sub: "baked and sold" },
    byGenerous && { icon: "💝", label: "Most Generous",      church: byGenerous, stat: formatCurrency(byGenerous.avgPerLoaf),  sub: "avg per loaf" },
    byRecent   && byRecent.recentSalesCount > 0 && {
      icon: "🔥", label: "On a Roll",  church: byRecent,  stat: `${byRecent.recentSalesCount} Sundays`, sub: "logged this month",
    },
  ].filter(Boolean) as { icon: string; label: string; church: ChurchStats; stat: string; sub: string }[];

  return (
    <div className="space-y-8">
      {/* Spotlight row */}
      {spotlights.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {spotlights.map((s) => (
            <Link
              key={s.label}
              href={`/churches/${s.church.id}`}
              className="group bg-white rounded-2xl border border-wheat/15 p-4 shadow-sm hover:border-wheat/40 hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-[11px] font-semibold text-wheat uppercase tracking-wide mb-1">{s.label}</div>
              <div className="font-serif text-sm font-bold text-foreground leading-tight">{s.church.name}</div>
              <div className="text-xs text-muted-foreground">{s.church.city}, {s.church.state}</div>
              <div className="mt-2 text-base font-bold text-foreground">{s.stat}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Sort tabs */}
        <div className="flex flex-wrap gap-1.5 flex-1">
          {SORT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSortBy(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                sortBy === tab.id
                  ? "bg-wheat text-white"
                  : "bg-white border border-wheat/20 text-muted-foreground hover:border-wheat/40 hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* State filter */}
        {uniqueStates.length > 1 && (
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="text-sm border border-wheat/20 rounded-xl px-3 py-1.5 bg-white text-foreground focus:outline-none focus:border-wheat shrink-0"
          >
            <option value="all">All States</option>
            {uniqueStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-wheat/15 p-12 text-center">
          <div className="text-4xl mb-3">🍞</div>
          <p className="text-muted-foreground">No churches found. Be the first in your state!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-wheat/15 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream border-b border-wheat/20">
              <tr>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium w-10">#</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Church</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Raised</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Loaves</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Bakers</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Avg/Loaf</th>
                <th className="w-8 px-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-wheat/10">
              {filtered.map((church, i) => (
                <tr key={church.id} className="hover:bg-cream/40 transition-colors group">
                  <td className="px-5 py-3.5 text-muted-foreground font-medium">
                    {i < 3 ? (
                      <span className="text-base">{RANK_MEDALS[i]}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{i + 1}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/churches/${church.id}`} className="hover:text-wheat transition-colors">
                      <div className="font-medium text-foreground leading-tight">{church.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{church.city}, {church.state}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-wheat hidden sm:table-cell">
                    {church.totalRaised > 0 ? formatCurrency(church.totalRaised) : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right hidden md:table-cell">
                    {church.totalLoaves > 0 ? formatNumber(church.totalLoaves) : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                    {church.bakerCount > 0 ? church.bakerCount : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right hidden lg:table-cell text-muted-foreground">
                    {church.avgPerLoaf > 0 ? formatCurrency(church.avgPerLoaf) : "—"}
                  </td>
                  <td className="px-3 py-3.5">
                    <Link href={`/churches/${church.id}`}>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-wheat transition-colors" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
