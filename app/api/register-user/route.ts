import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseServer = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, fullName, title, phoneNumber, emailAddress, businessAddress, serviceRadius, latitude, longitude, isVerified } = body;

    const { error } = await supabaseServer.from("Roofing_Auth").insert([
      {
        user_id,
        "Full Name": fullName,
        "Title": title,
        "Phone Number": phoneNumber,
        "Email Address": emailAddress,
        "Business Address": businessAddress,
        "Service Radius": serviceRadius,
        "Latitude": latitude,
        "Longitude": longitude,
        "Is Verified": isVerified,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ success: false, message: error.message });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
