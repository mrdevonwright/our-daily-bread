import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import type { Profile, SaleLog, Church } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Church as ChurchIcon, Users } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const p = profile as Profile;

  // Recent sales
  const { data: recentSales } = await supabase
    .from("sales_logs")
    .select("*")
    .eq("baker_id", user.id)
    .order("sold_at", { ascending: false })
    .limit(10);

  // Church stats if admin
  let church: Church | null = null;
  let churchBakerCount = 0;
  let churchTotalLoaves = 0;
  let churchTotalRaised = 0;

  if (p.church_id && (p.role === "church_admin" || p.role === "super_admin")) {
    const { data: churchData } = await supabase
      .from("churches")
      .select("*")
      .eq("id", p.church_id)
      .single();

    church = churchData as Church;

    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("church_id", p.church_id);
    churchBakerCount = count || 0;

    const { data: aggData } = await supabase
      .from("sales_logs")
      .select("loaves_count, amount_raised")
      .eq("church_id", p.church_id);

    if (aggData) {
      churchTotalLoaves = aggData.reduce((sum, r) => sum + r.loaves_count, 0);
      churchTotalRaised = aggData.reduce((sum, r) => sum + Number(r.amount_raised), 0);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Welcome back, {(p.full_name || "Baker").split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {p.role === "church_admin"
              ? `Managing ${church?.name || "your church"}`
              : "Your baker dashboard"}
          </p>
        </div>
        <Link href="/dashboard/sales">
          <Button className="bg-wheat hover:bg-wheat-dark text-white gap-2">
            <PlusCircle className="w-4 h-4" />
            Log Sales
          </Button>
        </Link>
      </div>

      {/* Setup CTA — shown until user joins or creates a church */}
      {!p.church_id && (
        <div className="bg-cream rounded-2xl border-2 border-wheat/30 p-8">
          <h2 className="font-serif text-xl font-bold mb-1">Complete your setup</h2>
          <p className="text-muted-foreground mb-6">
            Connect to a church to start logging sales and tracking your impact.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/onboarding?path=create"
              className="group flex items-start gap-4 bg-white rounded-xl border-2 border-border hover:border-wheat p-5 transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-wheat/10 flex items-center justify-center shrink-0 group-hover:bg-wheat/20 transition-colors">
                <ChurchIcon className="w-5 h-5 text-wheat" />
              </div>
              <div>
                <div className="font-semibold text-sm mb-0.5">Start a church ministry</div>
                <div className="text-xs text-muted-foreground">Register your church and become the admin.</div>
              </div>
            </Link>
            <Link
              href="/onboarding?path=join"
              className="group flex items-start gap-4 bg-white rounded-xl border-2 border-border hover:border-forest p-5 transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center shrink-0 group-hover:bg-forest/20 transition-colors">
                <Users className="w-5 h-5 text-forest" />
              </div>
              <div>
                <div className="font-semibold text-sm mb-0.5">Join an existing church</div>
                <div className="text-xs text-muted-foreground">Find your church and start logging sales.</div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Personal stats */}
      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Your Stats</h2>
        <StatsCards
          loavesSold={p.loaves_sold}
          moneyRaised={Number(p.money_raised)}
        />
      </div>

      {/* Church stats (admins) */}
      {church && (
        <div>
          <h2 className="font-serif text-xl font-semibold mb-4">
            {church.name} Church Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-wheat/15 shadow-sm">
              <div className="font-serif text-3xl font-bold text-wheat mb-1">
                {churchBakerCount}
              </div>
              <div className="text-sm text-muted-foreground">Active Bakers</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-wheat/15 shadow-sm">
              <div className="font-serif text-3xl font-bold text-wheat mb-1">
                {churchTotalLoaves.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Loaves Sold</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-wheat/15 shadow-sm">
              <div className="font-serif text-3xl font-bold text-wheat mb-1">
                {formatCurrency(churchTotalRaised)}
              </div>
              <div className="text-sm text-muted-foreground">Total Raised</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent sales */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold">Recent Sales</h2>
          <Link
            href="/dashboard/sales"
            className="text-sm text-wheat hover:underline"
          >
            Log new sale →
          </Link>
        </div>

        {!recentSales || recentSales.length === 0 ? (
          <div className="bg-white rounded-2xl border border-wheat/15 p-10 text-center">
            <span className="text-4xl block mb-3">🍞</span>
            <p className="text-muted-foreground mb-4">
              No sales logged yet. Start selling and log your first Sunday!
            </p>
            <Link href="/dashboard/sales">
              <Button className="bg-wheat hover:bg-wheat-dark text-white">
                Log My First Sale
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-wheat/15 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream border-b border-wheat/20">
                <tr>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Date</th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium">Loaves</th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium">Raised</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wheat/10">
                {(recentSales as SaleLog[]).map((sale) => (
                  <tr key={sale.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-5 py-3 text-foreground">
                      {formatDate(sale.sold_at)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">
                      {sale.loaves_count}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-wheat">
                      {formatCurrency(Number(sale.amount_raised))}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                      {sale.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
