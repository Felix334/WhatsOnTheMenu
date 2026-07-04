import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStaffAccess } from "@/lib/staffAuth";

export async function GET(req, { params }) {
  try {
    const { orderID } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderID },
      select: {
        id: true,
        restaurantId: true,
        tableNumber: true,
        items: true,
        note: true,
        status: true,
        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Nicht gefunden" }, { status: 404 });
    }

    // Zugriff wie beim Erstellen/Listen: jede Rolle außer "User" (Owner oder
    // freigeschalteter Staff des Restaurants). getStaffAccess prüft die Mitgliedschaft
    // UND das Professional-Abo des Owners frisch gegen die DB (kein veralteter JWT).
    const access = await getStaffAccess(req, order.restaurantId);
    if (!access) {
      return NextResponse.json({ message: "Nicht autorisiert" }, { status: 401 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}
