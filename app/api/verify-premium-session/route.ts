import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ paid: false });

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return NextResponse.json({
    paid: session.payment_status === "paid",
    lead_id: session.metadata?.lead_id,
    user_id: session.metadata?.user_id,
  });
}