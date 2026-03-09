import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Look up invite (use admin client — token lookup is public by intent)
    const { data: invite } = await adminClient
      .from("invitations")
      .select("id, church_id, email, expires_at, accepted_at")
      .eq("token", token)
      .single();

    if (!invite) {
      return NextResponse.json({ error: "Invalid invite link" }, { status: 404 });
    }

    if (invite.accepted_at) {
      return NextResponse.json({ error: "Invite already used" }, { status: 409 });
    }

    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: "Invite has expired" }, { status: 410 });
    }

    // Fetch user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("church_id")
      .eq("id", user.id)
      .single();

    const p = profile as Pick<Profile, "church_id"> | null;

    if (p?.church_id) {
      return NextResponse.json(
        { error: "You are already a member of a church" },
        { status: 409 }
      );
    }

    // Join the church — user updating their own profile, RLS allows this
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        church_id: invite.church_id,
        role: "baker",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // Mark invite accepted
    const { error: acceptError } = await adminClient
      .from("invitations")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", invite.id);

    if (acceptError) throw acceptError;

    return NextResponse.json({ success: true, church_id: invite.church_id });
  } catch (err) {
    console.error("Accept invite error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
