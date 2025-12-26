import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing code or state" },
        { status: 400 }
      );
    }

    // 🔹 Decode state
    const [contractorId, after] = state.split("|");

    if (!contractorId) {
      return NextResponse.json(
        { error: "Invalid state" },
        { status: 400 }
      );
    }

    // 🔹 Exchange code for token
    const tokenRes = await fetch("https://auth.calendly.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: process.env.CALENDLY_CLIENT_ID,
        client_secret: process.env.CALENDLY_CLIENT_SECRET,
        redirect_uri: process.env.CALENDLY_REDIRECT_URI,
        code,
      }),
    });

    const token = await tokenRes.json();

    if (!token.access_token) {
      console.error("Calendly token error:", token);
      return NextResponse.json(
        { error: "Token exchange failed" },
        { status: 400 }
      );
    }

    // 🔹 Save Calendly connection
    await getSupabaseAdmin()
      .from("contractor_calendly")
      .upsert({
        contractor_id: contractorId,
        calendly_access_token: token.access_token,
        calendly_refresh_token: token.refresh_token,
        calendly_expires_at: new Date(
          Date.now() + token.expires_in * 1000
        ).toISOString(),
      });

    // 🔁 Redirect based on intent
    if (after === "checkout") {
      return NextResponse.redirect(
        new URL(
          "/contractor/appointments?readyForPayment=true",
          req.url
        )
      );
    }

    // default / settings flow
    return NextResponse.redirect(
      new URL("/contractor/appointment-info", req.url)
    );

  } catch (err) {
    console.error("Calendly callback error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server";
// import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const code = searchParams.get("code");
//     const contractorId = searchParams.get("state");

//     if (!code || !contractorId) {
//       return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
//     }

//     // 🔹 Exchange code for token
//     const tokenRes = await fetch("https://auth.calendly.com/oauth/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         grant_type: "authorization_code",
//         client_id: process.env.CALENDLY_CLIENT_ID,
//         client_secret: process.env.CALENDLY_CLIENT_SECRET,
//         redirect_uri: process.env.CALENDLY_REDIRECT_URI,
//         code,
//       }),
//     });

//     const token = await tokenRes.json();

//     if (!token.access_token) {
//       console.error("Calendly token error:", token);
//       return NextResponse.json({ error: "Token exchange failed" }, { status: 400 });
//     }

//     // 🔹 Save / update calendly connection
//     await getSupabaseAdmin()
//       .from("contractor_calendly")
//       .upsert({
//         contractor_id: contractorId,
//         calendly_access_token: token.access_token,
//         calendly_refresh_token: token.refresh_token,
//         calendly_expires_at: new Date(
//           Date.now() + token.expires_in * 1000
//         ).toISOString(),
//       });

//     // ✅ ALWAYS redirect back to appointment page
//     return NextResponse.redirect(
//       new URL("/contractor/appointment-info", req.url)
//     );

//   } catch (err) {
//     console.error("Calendly callback error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }