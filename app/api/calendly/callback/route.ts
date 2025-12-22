import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const contractorId = searchParams.get("state");

    if (!code || !contractorId) {
      return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
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
      return NextResponse.json({ error: "Token exchange failed" }, { status: 400 });
    }

    // 🔹 Save / update calendly connection
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

    // ✅ ALWAYS redirect back to appointment page
    return NextResponse.redirect(
      new URL("/contractor/appointment-info", req.url)
    );

  } catch (err) {
    console.error("Calendly callback error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

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

//     const supabase = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.SUPABASE_SERVICE_ROLE_KEY!
//     );

//     // 🔹 Save / update calendly connection
//     await supabase
//       .from("contractor_calendly")
//       .upsert({
//         contractor_id: contractorId,
//         calendly_access_token: token.access_token,
//         calendly_refresh_token: token.refresh_token,
//         calendly_expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
//       });

//     // 🔹 Fetch the contractor's Calendly user URI
//     const userRes = await fetch("https://api.calendly.com/users/me", {
//       headers: { Authorization: `Bearer ${token.access_token}` },
//     });

//     const userJson = await userRes.json();
//     console.log(userJson.resource.timezone);
//     const userUri = userJson?.resource?.uri;

//     if (!userUri) {
//       console.error("Failed to fetch Calendly user URI", userJson);
//     } else {
//       // 🔹 Create webhook subscription for this contractor
//       // const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`; // your webhook endpoint
//       const callbackUrl = `https://mighty-lions-go.loca.lt/api/webhook`; // your webhook endpoint
//       const webhookRes = await fetch("https://api.calendly.com/webhook_subscriptions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token.access_token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           url: callbackUrl,
//           events: ["invitee.created", "invitee.canceled"],
//           scope: "user",
//           user: userUri
//         }),
//       });

//       const webhookData = await webhookRes.json();
//       console.log("Webhook created:", webhookData);
//     }

//     // ✅ Redirect back to appointment page
//     return NextResponse.redirect(new URL("/contractor/appointments", req.url));

//   } catch (err) {
//     console.error("Calendly callback error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }