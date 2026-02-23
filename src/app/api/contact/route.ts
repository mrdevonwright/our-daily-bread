import { NextResponse } from "next/server";
import { z } from "zod";
import { getResend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const supabase = createAdminClient();

    // Save to database
    await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
    });

    // Send notification email to admin
    const { error: emailError } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New contact: ${data.subject || "Message"} from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} &lt;${data.email}&gt;</p>
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:4px solid #C8973A;padding:8px 16px;margin:8px 0">
          ${data.message.replace(/\n/g, "<br>")}
        </blockquote>
        <hr>
        <p style="color:#888;font-size:12px">Sent from ourdailybread.club contact form</p>
      `,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: err.issues },
        { status: 400 }
      );
    }
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
