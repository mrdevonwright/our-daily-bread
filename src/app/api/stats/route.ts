import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 30;

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Query live counts for churches + bakers to avoid drift from the
    // denormalized global_stats counters. Loaves + raised stay from global_stats
    // since those are tightly maintained by triggers + our PATCH/DELETE routes.
    const [
      { data },
      { count: churchCount },
      { count: bakerCount },
    ] = await Promise.all([
      supabase.from("global_stats").select("*").eq("id", 1).single(),
      supabase.from("churches").select("*", { count: "exact", head: true }).eq("approved", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

    if (!data) {
      return NextResponse.json({
        id: 1,
        total_churches: churchCount ?? 0,
        total_bakers: bakerCount ?? 0,
        total_loaves: 0,
        total_raised: 0,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ...data,
      total_churches: churchCount ?? data.total_churches,
      total_bakers: bakerCount ?? data.total_bakers,
    });
  } catch {
    return NextResponse.json(
      {
        id: 1,
        total_churches: 0,
        total_bakers: 0,
        total_loaves: 0,
        total_raised: 0,
        updated_at: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
