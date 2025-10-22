import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("place_id");

  if (!placeId) {
    return NextResponse.json({ error: "Missing place_id" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
    );

    const data = await res.json();

    if (!data.result?.geometry?.location) {
      return NextResponse.json({ error: "No geometry found" }, { status: 404 });
    }

    const { lat, lng } = data.result.geometry.location;
    const formattedAddress = data.result.formatted_address;

    return NextResponse.json({ lat, lng, formattedAddress });
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 });
  }
}
