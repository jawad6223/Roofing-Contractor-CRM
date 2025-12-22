import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// 🔁 Helper: refresh Calendly token
async function refreshCalendlyToken(refreshToken: string) {
  const res = await fetch("https://auth.calendly.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.CALENDLY_CLIENT_ID,
      client_secret: process.env.CALENDLY_CLIENT_SECRET,
    }),
  });

  return res.json();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contractorId = searchParams.get("contractor_id");

    if (!contractorId) {
      return NextResponse.json(
        { error: "Missing contractor_id" },
        { status: 400 }
      );
    }

    // 1️⃣ Get contractor Calendly data
    const { data, error } = await getSupabaseAdmin()
      .from("contractor_calendly")
      .select(
        "calendly_access_token, calendly_refresh_token, calendly_expires_at"
      )
      .eq("contractor_id", contractorId)
      .single();

    if (error || !data?.calendly_access_token) {
      return NextResponse.json(
        { error: "Calendly not connected" },
        { status: 400 }
      );
    }

    let accessToken = data.calendly_access_token;

    // 2️⃣ Refresh token if expired
    if (
      data.calendly_expires_at &&
      new Date(data.calendly_expires_at) < new Date()
    ) {
      const newToken = await refreshCalendlyToken(
        data.calendly_refresh_token
      );

      if (!newToken.access_token) {
        return NextResponse.json(
          { error: "Calendly token refresh failed" },
          { status: 401 }
        );
      }

      accessToken = newToken.access_token;

      // save new token
      await getSupabaseAdmin()
        .from("contractor_calendly")
        .update({
          calendly_access_token: newToken.access_token,
          calendly_refresh_token: newToken.refresh_token,
          calendly_expires_at: new Date(
            Date.now() + newToken.expires_in * 1000
          ).toISOString(),
        })
        .eq("contractor_id", contractorId);
    }

    // 3️⃣ Get Calendly user
    const userRes = await fetch("https://api.calendly.com/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userJson = await userRes.json();

    if (!userJson?.resource?.uri) {
      console.error("Calendly user error:", userJson);
      return NextResponse.json(
        { error: "Failed to fetch Calendly user" },
        { status: 500 }
      );
    }

    const userUri = userJson.resource.uri;

    // 4️⃣ Get event types
    const eventRes = await fetch(
      `https://api.calendly.com/event_types?user=${encodeURIComponent(
        userUri
      )}&active=true&count=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const eventJson = await eventRes.json();

    if (!eventJson?.collection?.length) {
      console.error("Calendly event error:", eventJson);
      return NextResponse.json(
        { error: "No active event types found" },
        { status: 404 }
      );
    }

    const firstEvent = eventJson.collection[0];

    // 5️⃣ Return embed URL
    return NextResponse.json({
      name: firstEvent.name,
      scheduling_url: firstEvent.scheduling_url,
    });
  } catch (err) {
    console.error("Calendly first-event error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
