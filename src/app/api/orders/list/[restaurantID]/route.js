import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStaffAccess } from "@/lib/staffAuth";

export async function GET(req, { params }) {
  try {
    const { restaurantID } = await params;

    // Wie beim Erstellen: jede Rolle außer "User" (Owner/Staff des Professional-
    // Restaurants) darf die Bestellungen sehen.
    const access = await getStaffAccess(req, restaurantID);
    if (!access) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurantID,
        status: { in: ["pending", "confirmed"] },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}
