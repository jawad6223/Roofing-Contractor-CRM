import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { leadAmount, leadName, user_id, lead_id } = await request.json();

    if (!leadAmount) {
      return NextResponse.json({ error: "Missing lead amount" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: leadName || "Premium Lead",
            },
            unit_amount: Math.round(leadAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        lead_id,
        user_id,
      },
      success_url: `${request.headers.get("origin")}/premiumSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe single checkout error:", err);
    return NextResponse.json(
      { error: "Single checkout session creation failed" },
      { status: 500 }
    );
  }
}
