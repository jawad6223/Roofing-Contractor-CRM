// /app/api/check-email/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Fetch users from Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) return NextResponse.json({ success: false, message: error.message });

    // Check if email exists
    const exists = data.users.some(u => u.email === email);

    return NextResponse.json({ exists });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal Server Error" });
  }
}
