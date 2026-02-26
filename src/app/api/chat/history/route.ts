import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use the user's session — RLS ensures they only get their own rows.
  // Exclude summary rows; those are server-side context only.
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .in("role", ["user", "assistant"])
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data ?? [] });
}
