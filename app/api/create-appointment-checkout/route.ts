import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { appointmentAmount, contractorId } = await request.json();

    if (!appointmentAmount) {
      return NextResponse.json({ error: "Missing appointment amount" }, { status: 400 });
    }

    if (!contractorId) {
      return NextResponse.json({ error: "Missing contractor ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Appointment",
            },
            unit_amount: Math.round(appointmentAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/appointment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/cancel`,
      metadata: {
        contractor_id: contractorId,
        appointment_amount: appointmentAmount.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe appointment checkout error:", err);
    return NextResponse.json(
      { error: "Appointment checkout session creation failed" },
      { status: 500 }
    );
  }
}
