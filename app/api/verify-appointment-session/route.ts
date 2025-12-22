import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({
      paid: false,
      error: "Missing session_id",
    });
  }

  try {
    // 1️⃣ Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ paid: false });
    }

    const contractorId = session.metadata?.contractor_id;
    const appointmentAmount = session.metadata?.appointment_amount
      ? parseFloat(session.metadata.appointment_amount)
      : 350;

    if (!contractorId) {
      return NextResponse.json({
        paid: true,
        error: "Missing contractor_id",
      });
    }

    // 2️⃣ Check if appointment already created
    const { data: existingRequest } = await getSupabaseAdmin()
      .from("Appointments_Request")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .single();

    // 3️⃣ Create appointment request ONLY ONCE
    if (!existingRequest) {
      const { error: insertError } = await getSupabaseAdmin()
        .from("Appointments_Request")
        .insert({
          Contractor_Id: contractorId,
          Price: appointmentAmount,
          Status: "Pending",
          date: new Date().toISOString(),
          stripe_session_id: sessionId,
        });

      if (insertError) {
        console.error("❌ Insert appointment error:", insertError);
        return NextResponse.json({
          paid: true,
          error: "Failed to create appointment request",
        });
      }

      console.log("✅ Appointment request created for session:", sessionId);
    } else {
      console.log("ℹ️ Appointment already exists for session:", sessionId);
    }

    // 4️⃣ Check Calendly connection
    const { data: calendly } = await getSupabaseAdmin()
      .from("contractor_calendly")
      .select("id")
      .eq("contractor_id", contractorId)
      .single();

    return NextResponse.json({
      paid: true,
      calendlyConnected: !!calendly,
    });
  } catch (error) {
    console.error("❌ Error verifying appointment session:", error);
    return NextResponse.json({
      paid: false,
      error: "Verification failed",
    });
  }
}
