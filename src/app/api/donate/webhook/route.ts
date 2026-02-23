import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import type Stripe from "stripe";

// IMPORTANT: Do NOT use bodyParser — raw body needed for signature verification
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature invalid" },
      { status: 400 }
    );
  }

  // Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email || session.customer_details?.email;

      if (customerEmail) {
        // Send thank-you email
        await getResend().emails.send({
          from: FROM_EMAIL,
          to: customerEmail,
          subject: "Thank you for supporting Our Daily Bread!",
          html: `
            <h1>Thank You!</h1>
            <p>Your generous donation of $${((session.amount_total || 0) / 100).toFixed(2)} has been received.</p>
            <p>Your support helps the Our Daily Bread movement reach more churches across America.</p>
            <blockquote style="border-left:4px solid #C8973A;padding:8px 16px;font-style:italic">
              "Give us this day our daily bread." — Matthew 6:11
            </blockquote>
            <p>
              <a href="https://ourdailybread.club" style="color:#C8973A">
                Visit ourdailybread.club
              </a>
            </p>
            <p style="color:#888;font-size:12px">
              This receipt confirms your ${
                session.mode === "subscription" ? "monthly" : "one-time"
              } donation. Stripe will also send a separate payment receipt.
            </p>
          `,
        }).catch((e) => console.error("Thank-you email error:", e));
      }
      break;
    }

    default:
      // Unhandled event — that's fine
      break;
  }

  return NextResponse.json({ received: true });
}
