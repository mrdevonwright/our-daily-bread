import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const search = searchParams.get("search");

    const supabase = createAdminClient();
    let query = supabase
      .from("churches")
      .select("id, name, city, state, denomination")
      .eq("approved", true)
      .order("name");

    if (state) {
      query = query.eq("state", state);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Churches API error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
