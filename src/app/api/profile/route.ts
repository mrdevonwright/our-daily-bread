import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  full_name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(500).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  address: z.string().max(200).nullable().optional(),
});

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = schema.parse(body);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        bio: data.bio ?? null,
        phone: data.phone ?? null,
        address: data.address ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error("Profile PATCH error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
