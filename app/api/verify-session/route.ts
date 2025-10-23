// /api/verify-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ paid: false, error: "Missing session_id" });

  try {
    // 1️⃣ Check if this session already processed
    const { data: existing } = await supabase
      .from("Processed_Sessions")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (existing) {
      console.log("⚠️ Session already processed:", sessionId);
      return NextResponse.json({ paid: true, alreadyProcessed: true, quantity: existing.quantity });
    }

    // 2️⃣ Verify payment from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const quantity = session.metadata?.quantity
        ? parseInt(session.metadata.quantity)
        : 1;
      const contractorId = session.metadata?.contractor_id || null;

      // 3️⃣ Insert record to mark session as processed
      await supabase.from("Processed_Sessions").insert([
        {
          session_id: sessionId,
          contractor_id: contractorId,
          quantity,
          status: "paid",
        },
      ]);

      return NextResponse.json({ paid: true, quantity, alreadyProcessed: false });
    } else {
      return NextResponse.json({ paid: false });
    }
  } catch (error) {
    console.error("❌ Error verifying session:", error);
    return NextResponse.json({ paid: false, error: "Verification failed" });
  }
}
