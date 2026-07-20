import { NextResponse } from "next/server";
import { getRestaurantMenuData } from "./data";

// ✅ force-dynamic entfernt – next: { revalidate: 300 } im Frontend übernimmt das Caching
export async function GET(req, { params }) {
  try {
    const { restaurantID } = await params;

    if (!restaurantID) {
      return NextResponse.json({ message: "Restaurant ID is required" }, { status: 400 });
    }

    const data = await getRestaurantMenuData(restaurantID);
    if (!data) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(data, {
      headers: {
        // ✅ Cache-Control Header bleibt für CDN/Proxy-Caching
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
