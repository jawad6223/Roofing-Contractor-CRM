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
    const { userId, newEmail } = await req.json();

    if (!userId || !newEmail) {
      return NextResponse.json({ error: "Missing userId or newEmail" }, { status: 400 });
    }

    console.log("📩 Updating email for user:", userId, "→", newEmail);

    const { data: user, error: userError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        email: newEmail,
        email_confirm: true
      }
    );

    if (userError) {
      console.error("⚠️ Failed to update email:", userError);
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    console.log("✅ Auth email updated successfully");
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("💥 Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
