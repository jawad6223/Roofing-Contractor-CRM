// /app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data: admin, error } = await supabaseAdmin
      .from("Admin")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !admin)
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid)
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );

    return NextResponse.json({ success: true, admin });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
