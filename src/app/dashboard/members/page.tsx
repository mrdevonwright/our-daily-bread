import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MembersTable } from "@/components/dashboard/MembersTable";
import type { Profile } from "@/lib/types";
import Link from "next/link";

export default async function MembersPage() {
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

  const p = profile as Profile;

  if (!p || !["church_admin", "super_admin"].includes(p.role)) {
    redirect("/dashboard");
  }

  if (!p.church_id) {
    redirect("/dashboard");
  }

  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .eq("church_id", p.church_id)
    .order("money_raised", { ascending: false });

  const typedMembers = (members as Profile[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Church Members</h1>
          <p className="text-muted-foreground mt-1">
            {typedMembers.length} baker{typedMembers.length !== 1 ? "s" : ""}{" "}
            in your church
          </p>
        </div>
      </div>

      <MembersTable members={typedMembers} />

      <div className="bg-wheat/5 border border-wheat/20 rounded-xl p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Recruit more bakers:</strong> Share
        this link with your congregation:{" "}
        <code className="bg-white px-2 py-0.5 rounded text-xs border border-wheat/20">
          ourdailybread.club/signup
        </code>
        . They&rsquo;ll find your church by state when they sign up.
      </div>

      <div className="bg-wheat/5 border border-wheat/20 rounded-xl p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Send a bulk message:</strong> Use the{" "}
        <Link href="/contact" className="text-wheat hover:underline">
          contact form
        </Link>{" "}
        to reach us about any issues, or use the email buttons above to message
        individual bakers.
      </div>
    </div>
  );
}
