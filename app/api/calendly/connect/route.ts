import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contractorId = searchParams.get("contractorId");

  if (!contractorId) {
    return NextResponse.json({ error: "Missing contractorId" }, { status: 400 });
  }

  const url =
    "https://auth.calendly.com/oauth/authorize" +
    `?client_id=${process.env.CALENDLY_CLIENT_ID}` +
    "&response_type=code" +
    `&redirect_uri=${process.env.CALENDLY_REDIRECT_URI}` +
    `&state=${contractorId}`;

  return NextResponse.redirect(url);
}
