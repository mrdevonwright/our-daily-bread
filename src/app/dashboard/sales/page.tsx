import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SalesLogForm } from "@/components/dashboard/SalesLogForm";
import type { Profile, Church } from "@/lib/types";
import { AlertCircle } from "lucide-react";

export default async function SalesPage() {
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

  let churchName = "";
  if (p.church_id) {
    const { data: church } = await supabase
      .from("churches")
      .select("name")
      .eq("id", p.church_id)
      .single();
    churchName = (church as Church | null)?.name ?? "";
  }

  const bakerName = p.full_name || "";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Log Sales</h1>
        <p className="text-muted-foreground mt-1">
          Record bread sold after Sunday service. Each entry updates the live
          ticker on the homepage.
        </p>
      </div>

      {!p.church_id ? (
        <div className="bg-white rounded-2xl border border-wheat/20 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-wheat mx-auto mb-3" />
          <h2 className="font-serif text-xl font-semibold mb-2">
            No Church Linked
          </h2>
          <p className="text-muted-foreground text-sm">
            Your account isn&rsquo;t linked to a church yet. Please contact your
            church admin or{" "}
            <a href="/contact" className="text-wheat hover:underline">
              reach out to us
            </a>{" "}
            for help.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-wheat/15 shadow-sm p-8">
          <SalesLogForm
            bakerId={p.id}
            churchId={p.church_id}
            churchName={churchName}
            bakerName={bakerName}
          />
        </div>
      )}

      <div className="bg-wheat/5 border border-wheat/20 rounded-xl p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Tip:</strong> Log sales right after
        Sunday service while it&rsquo;s fresh. Each entry adds to your personal
        stats, your church&rsquo;s total, and the national movement ticker.
      </div>
    </div>
  );
}
