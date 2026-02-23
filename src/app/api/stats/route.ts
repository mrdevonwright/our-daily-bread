import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 30;

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("global_stats")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      // Return zeroed stats if table doesn't exist yet
      return NextResponse.json({
        id: 1,
        total_churches: 0,
        total_bakers: 0,
        total_loaves: 0,
        total_raised: 0,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(data);
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
