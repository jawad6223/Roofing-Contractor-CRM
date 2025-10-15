import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(req: Request) {
  try {
    const { userId, oldEmail, newEmail, fullName, businessAddress, pricePerLead } = await req.json();

    if (!userId || !oldEmail || !newEmail) {
      return NextResponse.json({ error: "Missing userId, oldEmail or newEmail" }, { status: 400 });
    }

    console.log("📩 Updating admin email:", oldEmail, "→", newEmail);

    const { data: user, error: userError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        email: newEmail,
        email_confirm: true
      }
    );

    if (userError) {
      console.error("⚠️ Failed to update admin email:", userError);
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    const { error: dbError } = await supabaseAdmin
      .from("Admin_Data")
      .update({
        "Full Name": fullName,
        "Email Address": newEmail,
        "Business Address": businessAddress,
        "Price Per Lead": pricePerLead,
      })
      .eq("Email Address", oldEmail);

    if (dbError) {
      console.error("Failed to update Admin_Data:", dbError);
      return NextResponse.json({ error: "Failed to update admin data" }, { status: 400 });
    }

    console.log("Admin email and profile updated successfully in both auth and Admin_Data");
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
