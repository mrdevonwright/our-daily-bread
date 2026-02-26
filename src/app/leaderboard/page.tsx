import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { LeaderboardClient } from "@/components/leaderboard/LeaderboardClient";
import type { ChurchStats } from "@/components/leaderboard/LeaderboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Church Leaderboard",
  description: "See how every church in the Our Daily Bread movement is doing — loaves sold, money raised, and more.",
};

export const revalidate = 60; // ISR — fresh every minute

export default async function LeaderboardPage() {
  const admin = createAdminClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10);

  const [
    { data: churches },
    { data: allSales },
    { data: allBakers },
  ] = await Promise.all([
    admin
      .from("churches")
      .select("id, name, city, state, denomination, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false }),
    admin
      .from("sales_logs")
      .select("church_id, loaves_count, amount_raised, sold_at"),
    admin
      .from("profiles")
      .select("church_id")
      .not("church_id", "is", null),
  ]);

  const churchStats: ChurchStats[] = (churches ?? []).map((church) => {
    const sales = (allSales ?? []).filter((s) => s.church_id === church.id);
    const bakerCount = (allBakers ?? []).filter((b) => b.church_id === church.id).length;

    const totalLoaves = sales.reduce((sum, s) => sum + s.loaves_count, 0);
    const totalRaised = sales.reduce((sum, s) => sum + Number(s.amount_raised), 0);
    const avgPerLoaf = totalLoaves > 0 ? totalRaised / totalLoaves : 0;

    const sorted = [...sales].sort((a, b) => (b.sold_at > a.sold_at ? 1 : -1));
    const lastSaleDate = sorted[0]?.sold_at ?? null;
    const recentSalesCount = sales.filter((s) => s.sold_at >= thirtyDaysAgoStr).length;

    return {
      ...church,
      totalLoaves,
      totalRaised,
      bakerCount,
      avgPerLoaf,
      lastSaleDate,
      recentSalesCount,
      salesCount: sales.length,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-3">
          Church Leaderboard
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Every loaf baked in Jesus&apos; name. Every dollar back to the church. See how the
          Our Daily Bread movement is growing — one Sunday at a time.
        </p>
      </div>

      {churchStats.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🌾</div>
          <h2 className="font-serif text-2xl font-bold mb-2">The first loaf is coming.</h2>
          <p className="text-muted-foreground mb-6">
            Be the church that starts it all in your community.
          </p>
          <a
            href="/signup"
            className="inline-block bg-wheat hover:bg-wheat-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Start a Ministry →
          </a>
        </div>
      ) : (
        <LeaderboardClient churches={churchStats} />
      )}
    </div>
  );
}
