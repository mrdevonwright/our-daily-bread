import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";

const schema = z.object({
  amount: z.number().min(1, "Minimum donation is $1"),
  is_recurring: z.boolean().default(false),
  donor_email: z.string().email().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const amountInCents = Math.round(data.amount * 100);

    let session;

    if (data.is_recurring) {
      // Recurring: create a price on the fly and use subscription mode
      session = await getStripe().checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              recurring: { interval: "month" },
              product_data: {
                name: "Our Daily Bread Movement — Monthly Support",
                description:
                  "Monthly donation to support the Our Daily Bread movement",
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/donate`,
        ...(data.donor_email && { customer_email: data.donor_email }),
        metadata: {
          type: "recurring_donation",
          amount: data.amount.toString(),
        },
      });
    } else {
      // One-time payment
      session = await getStripe().checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Our Daily Bread Movement — One-Time Donation",
                description:
                  "One-time donation to support the Our Daily Bread movement",
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/donate`,
        ...(data.donor_email && { customer_email: data.donor_email }),
        metadata: {
          type: "one_time_donation",
          amount: data.amount.toString(),
        },
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Payment setup failed" }, { status: 500 });
  }
}
