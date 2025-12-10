import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { quantity, leadAmount, userId } = await request.json();

    if (!quantity || !leadAmount) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Premium Leads' },
            unit_amount: leadAmount * 100,
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/cancel`,
      // allow_promotion_codes: true,
      metadata: {
        quantity: quantity.toString(),
        contractor_id: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: (err as Error).message || "Checkout session creation failed" }, { status: 500 });
  }
}