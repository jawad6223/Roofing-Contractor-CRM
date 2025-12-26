import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contractorId = searchParams.get("contractorId");

  if (!contractorId) {
    return NextResponse.json({ connected: false });
  }

  const { data } = await getSupabaseAdmin()
    .from("contractor_calendly")
    .select("id")
    .eq("contractor_id", contractorId)
    .single();

  return NextResponse.json({
    connected: !!data,
  });
}
