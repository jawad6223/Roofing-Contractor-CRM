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
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const contractorId = session.metadata?.contractor_id || null;
      const appointmentAmount = session.metadata?.appointment_amount 
        ? parseFloat(session.metadata.appointment_amount) 
        : 350;

      if (contractorId) {
        const { data: insertedData, error: insertError } = await supabase
          .from("Appointments_Request")
          .insert([
            {
              Contractor_Id: contractorId,
              Price: appointmentAmount,
              Status: "Pending",
              date: new Date().toISOString(),
            },
          ])
          .select();

        if (insertError) {
          console.error("Error inserting appointment request:", insertError);
          console.error("Error details:", JSON.stringify(insertError, null, 2));
          return NextResponse.json({ 
            paid: true, 
            error: "Failed to create appointment request",
            details: insertError.message 
          });
        }

        console.log("✅ Appointment request created successfully:", insertedData);
      }

      return NextResponse.json({ paid: true, alreadyProcessed: false });
    } else {
      return NextResponse.json({ paid: false });
    }
  } catch (error) {
    console.error("❌ Error verifying appointment session:", error);
    return NextResponse.json({ paid: false, error: "Verification failed" });
  }
}

