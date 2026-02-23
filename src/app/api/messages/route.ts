import { NextResponse } from "next/server";
import { z } from "zod";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  to: z.string().email(),
  to_name: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify sender is a church_admin or super_admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, church_id")
      .eq("id", user.id)
      .single();

    if (!profile || !["church_admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = schema.parse(body);

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: data.to,
      replyTo: user.email,
      subject: data.subject,
      html: `
        <p>Hi ${data.to_name},</p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#888;font-size:12px">
          This message was sent by ${profile.full_name} via the
          Our Daily Bread church admin dashboard.<br>
          <a href="https://ourdailybread.club">ourdailybread.club</a>
        </p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("Messages API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
