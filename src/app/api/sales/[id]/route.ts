import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  loaves_count: z.number().int().min(1),
  amount_raised: z.number().min(0),
  sold_at: z.string().min(1),
  notes: z.string().optional().nullable(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = patchSchema.parse(body);

    const admin = createAdminClient();

    // Fetch original to verify ownership and get values for diff
    const { data: old, error: fetchErr } = await admin
      .from("sales_logs")
      .select("id, baker_id, loaves_count, amount_raised")
      .eq("id", params.id)
      .single();

    if (fetchErr || !old) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (old.baker_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: sale, error: updateErr } = await admin
      .from("sales_logs")
      .update({ loaves_count: data.loaves_count, amount_raised: data.amount_raised, sold_at: data.sold_at, notes: data.notes ?? null })
      .eq("id", params.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // Apply diff to aggregates
    const loavesDiff = data.loaves_count - old.loaves_count;
    const amountDiff = data.amount_raised - Number(old.amount_raised);

    if (loavesDiff !== 0 || amountDiff !== 0) {
      const [{ data: profile }, { data: stats }] = await Promise.all([
        admin.from("profiles").select("loaves_sold, money_raised").eq("id", user.id).single(),
        admin.from("global_stats").select("total_loaves, total_raised").eq("id", 1).single(),
      ]);

      await Promise.all([
        profile && admin.from("profiles").update({
          loaves_sold: Math.max(0, profile.loaves_sold + loavesDiff),
          money_raised: Math.max(0, Number(profile.money_raised) + amountDiff),
          updated_at: new Date().toISOString(),
        }).eq("id", user.id),
        stats && admin.from("global_stats").update({
          total_loaves: Math.max(0, stats.total_loaves + loavesDiff),
          total_raised: Math.max(0, Number(stats.total_raised) + amountDiff),
          updated_at: new Date().toISOString(),
        }).eq("id", 1),
      ]);
    }

    return NextResponse.json({ sale });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    console.error("Sales PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();

    const { data: sale, error: fetchErr } = await admin
      .from("sales_logs")
      .select("id, baker_id, loaves_count, amount_raised")
      .eq("id", params.id)
      .single();

    if (fetchErr || !sale) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (sale.baker_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { error: deleteErr } = await admin.from("sales_logs").delete().eq("id", params.id);
    if (deleteErr) throw deleteErr;

    // Reverse aggregates
    const [{ data: profile }, { data: stats }] = await Promise.all([
      admin.from("profiles").select("loaves_sold, money_raised").eq("id", user.id).single(),
      admin.from("global_stats").select("total_loaves, total_raised").eq("id", 1).single(),
    ]);

    await Promise.all([
      profile && admin.from("profiles").update({
        loaves_sold: Math.max(0, profile.loaves_sold - sale.loaves_count),
        money_raised: Math.max(0, Number(profile.money_raised) - Number(sale.amount_raised)),
        updated_at: new Date().toISOString(),
      }).eq("id", user.id),
      stats && admin.from("global_stats").update({
        total_loaves: Math.max(0, stats.total_loaves - sale.loaves_count),
        total_raised: Math.max(0, Number(stats.total_raised) - Number(sale.amount_raised)),
        updated_at: new Date().toISOString(),
      }).eq("id", 1),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sales DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
