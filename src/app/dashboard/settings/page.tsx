import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import type { Profile, Church } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const p = profile as Profile;

  const church = p.church_id
    ? ((await supabase.from("churches").select("*").eq("id", p.church_id).single()).data as Church | null)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account info.</p>
      </div>

      <SettingsForm profile={p} church={church} />
    </div>
  );
}
