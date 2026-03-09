import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MembersTable } from "@/components/dashboard/MembersTable";
import { InviteButton } from "@/components/dashboard/InviteButton";
import type { Profile } from "@/lib/types";

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
        <InviteButton />
      </div>

      <MembersTable members={typedMembers} currentUserId={p.id} />
    </div>
  );
}
