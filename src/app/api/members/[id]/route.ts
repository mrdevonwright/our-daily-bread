import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch caller's profile
    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("role, church_id")
      .eq("id", user.id)
      .single();

    const caller = callerProfile as Pick<Profile, "role" | "church_id"> | null;

    if (!caller || !["church_admin", "super_admin"].includes(caller.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!caller.church_id) {
      return NextResponse.json({ error: "No church associated" }, { status: 400 });
    }

    if (id === user.id) {
      return NextResponse.json({ error: "Cannot remove yourself" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Fetch target profile to verify same church
    const { data: targetProfile } = await adminClient
      .from("profiles")
      .select("church_id")
      .eq("id", id)
      .single();

    if (!targetProfile) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (targetProfile.church_id !== caller.church_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Remove from church
    const { error } = await adminClient
      .from("profiles")
      .update({ church_id: null, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Remove member error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
