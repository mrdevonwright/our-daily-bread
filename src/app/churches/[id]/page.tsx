import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { ChurchTrendChart } from "@/components/churches/ChurchTrendChart";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Wheat, DollarSign, Users, TrendingUp, MapPin, ArrowLeft } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const admin = createAdminClient();
  const { data: church } = await admin
    .from("churches")
    .select("name, city, state")
    .eq("id", params.id)
    .eq("approved", true)
    .single();

  if (!church) return { title: "Church Not Found" };

  return {
    title: `${church.name} — ${church.city}, ${church.state}`,
    description: `See how ${church.name} in ${church.city}, ${church.state} is serving their community through the Our Daily Bread movement.`,
  };
}

export default async function ChurchProfilePage({ params }: Props) {
  const admin = createAdminClient();

  const [
    { data: church },
    { data: sales },
    { count: bakerCount },
  ] = await Promise.all([
    admin
      .from("churches")
      .select("*")
      .eq("id", params.id)
      .eq("approved", true)
      .single(),
    admin
      .from("sales_logs")
      .select("loaves_count, amount_raised, sold_at")
      .eq("church_id", params.id)
      .order("sold_at", { ascending: true }),
    admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("church_id", params.id),
  ]);

  if (!church) notFound();

  // Fetch approved stories from this church's bakers
  const { data: bakerIds } = await admin
    .from("profiles")
    .select("id")
    .eq("church_id", params.id);

  const ids = (bakerIds ?? []).map((b) => b.id);

  const stories =
    ids.length > 0
      ? (
          await admin
            .from("story_submissions")
            .select("id, name, story, created_at")
            .in("submitted_by", ids)
            .eq("approved", true)
            .order("created_at", { ascending: false })
            .limit(6)
        ).data ?? []
      : [];

  // Aggregate stats
  const totalLoaves = (sales ?? []).reduce((sum, s) => sum + s.loaves_count, 0);
  const totalRaised = (sales ?? []).reduce((sum, s) => sum + Number(s.amount_raised), 0);
  const avgPerLoaf = totalLoaves > 0 ? totalRaised / totalLoaves : 0;
  const salesCount = sales?.length ?? 0;

  const statCards = [
    {
      icon: DollarSign,
      label: "Total Raised",
      value: formatCurrency(totalRaised),
      sub: "for the congregation",
    },
    {
      icon: Wheat,
      label: "Loaves Sold",
      value: formatNumber(totalLoaves),
      sub: `across ${salesCount} Sunday${salesCount !== 1 ? "s" : ""}`,
    },
    {
      icon: Users,
      label: "Bakers",
      value: String(bakerCount ?? 0),
      sub: "serving their church",
    },
    {
      icon: TrendingUp,
      label: "Avg per Loaf",
      value: avgPerLoaf > 0 ? formatCurrency(avgPerLoaf) : "—",
      sub: "generosity per loaf",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
      {/* Back */}
      <Link
        href="/leaderboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-wheat transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Leaderboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          {church.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {church.city}, {church.state}
          </span>
          {church.denomination && (
            <span className="bg-wheat/10 text-wheat rounded-full px-2.5 py-0.5 text-xs font-medium">
              {church.denomination}
            </span>
          )}
          {church.website && (
            <a
              href={church.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-wheat transition-colors"
            >
              {church.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-wheat/15 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-wheat/10 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-wheat" />
              </div>
              <div className="font-serif text-2xl font-bold text-foreground mb-0.5">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-wheat/80 mt-0.5">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Trend chart */}
      {salesCount > 0 && (
        <div className="bg-white rounded-2xl border border-wheat/15 shadow-sm px-6 pt-5 pb-4">
          <p className="text-sm font-medium text-foreground mb-4">
            Money Raised
            <span className="text-muted-foreground font-normal ml-1.5">over time</span>
          </p>
          <ChurchTrendChart sales={sales ?? []} />
        </div>
      )}

      {/* Stories */}
      {stories.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold mb-5">
            From the kitchen 🍞
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl border border-wheat/15 p-5 shadow-sm"
              >
                <p className="text-sm text-foreground leading-relaxed italic">
                  &ldquo;{story.story}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground mt-3 font-medium">
                  — {story.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="bg-cream rounded-2xl border-2 border-wheat/20 p-8 text-center">
        <h2 className="font-serif text-2xl font-bold mb-2">
          Inspired by {church.name}?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Every church in this movement started with one baker and one loaf.
          Join them — or start the movement in your own congregation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="bg-wheat hover:bg-wheat-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Join the Movement →
          </Link>
          <Link
            href="/leaderboard"
            className="border border-wheat/40 text-wheat hover:bg-wheat/10 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            See All Churches
          </Link>
        </div>
      </div>
    </div>
  );
}
