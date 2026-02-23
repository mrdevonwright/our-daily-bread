import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  baker_id: z.string().uuid(),
  church_id: z.string().uuid(),
  loaves_count: z.number().int().min(1),
  amount_raised: z.number().min(0),
  sold_at: z.string(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = schema.parse(body);

    // Ensure the baker_id matches the authenticated user
    if (data.baker_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Insert sale (DB triggers handle updating profiles and global_stats)
    const { data: sale, error } = await supabase
      .from("sales_logs")
      .insert({
        baker_id: data.baker_id,
        church_id: data.church_id,
        loaves_count: data.loaves_count,
        amount_raised: data.amount_raised,
        sold_at: data.sold_at,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Return updated profile stats
    const { data: profile } = await supabase
      .from("profiles")
      .select("loaves_sold, money_raised")
      .eq("id", user.id)
      .single();

    return NextResponse.json({ sale, profile });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: err.issues },
        { status: 400 }
      );
    }
    console.error("Sales API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
