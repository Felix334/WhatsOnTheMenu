import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { restaurantId, tableNumber, items, note } = await req.json();

    if (!restaurantId || !tableNumber || !items?.length) {
      return NextResponse.json({ message: "Fehlende Felder" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true },
    });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant nicht gefunden" }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        restaurantId,
        tableNumber,
        items,
        note: note || null,
        status: "pending",
      },
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}
