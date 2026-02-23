import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import type { Profile } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  const typedProfile = profile as Profile;

  return (
    <div className="flex min-h-screen bg-cream">
      <DashboardSidebar
        role={typedProfile.role}
        fullName={typedProfile.full_name}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
