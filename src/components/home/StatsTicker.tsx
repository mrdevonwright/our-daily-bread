"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatNumber } from "@/lib/utils";
import type { GlobalStats } from "@/lib/types";
import { Church, Users, Wheat, DollarSign } from "lucide-react";

function useCountUp(target: number, duration = 1500) {
  const [current, setCurrent] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    prevTarget.current = target;
  }, [target, duration]);

  return current;
}

interface TickerCardProps {
  icon: React.ElementType;
  value: number;
  label: string;
  prefix?: string;
  isCurrency?: boolean;
  href?: string;
}

function TickerCard({ icon: Icon, value, label, prefix = "", isCurrency = false, href }: TickerCardProps) {
  const animated = useCountUp(value);

  const formatted = isCurrency
    ? `$${formatNumber(animated)}`
    : `${prefix}${formatNumber(animated)}`;

  const inner = (
    <div className={`flex flex-col items-center text-center px-6 py-8 group ${href ? "cursor-pointer" : ""}`}>
      <div className="w-12 h-12 rounded-full bg-wheat/10 flex items-center justify-center mb-4 group-hover:bg-wheat/20 transition-colors">
        <Icon className="w-5 h-5 text-wheat" />
      </div>
      <div className="font-serif text-4xl md:text-5xl font-bold text-foreground tabular-nums mb-2">
        {formatted}
      </div>
      <div className={`text-sm uppercase tracking-wider font-medium transition-colors ${href ? "text-muted-foreground group-hover:text-wheat" : "text-muted-foreground"}`}>
        {label}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}

interface StatsTickerProps {
  initialStats: GlobalStats;
}

export function StatsTicker({ initialStats }: StatsTickerProps) {
  const [stats, setStats] = useState(initialStats);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("global_stats_realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "global_stats",
          filter: "id=eq.1",
        },
        (payload) => {
          setStats(payload.new as GlobalStats);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <section className="bg-white border-y border-wheat/20 py-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-2 font-medium">
          Movement Impact — Updated Live
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-wheat/20">
          <TickerCard
            icon={Church}
            value={stats.total_churches}
            label="Churches"
            href="/leaderboard"
          />
          <TickerCard
            icon={Users}
            value={stats.total_bakers}
            label="Bakers"
            href="/social"
          />
          <TickerCard
            icon={Wheat}
            value={stats.total_loaves}
            label="Loaves Sold"
          />
          <TickerCard
            icon={DollarSign}
            value={Math.round(stats.total_raised)}
            label="Raised for Churches"
            isCurrency
          />
        </div>
      </div>
    </section>
  );
}
