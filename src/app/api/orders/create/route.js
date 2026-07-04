import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStaffAccess } from "@/lib/staffAuth";

export async function POST(req) {
  try {
    const { restaurantId, tableNumber, items, note } = await req.json();

    // Jede Rolle außer einem einfachen "User" darf Bestellungen aufnehmen: getStaffAccess
    // liefert nur für den Owner oder freigeschaltete Staff eines Professional-Restaurants
    // ein Ergebnis. Die feingranulare "orders"-Berechtigung wird hier bewusst nicht geprüft.
    const access = await getStaffAccess(req, restaurantId);
    if (!access) {
      return NextResponse.json({ message: "Nicht autorisiert" }, { status: 401 });
    }

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

    // Nur dishId + Menge aus dem Request übernehmen. Preis und Name kommen
    // ausschließlich aus der DB – sonst könnte der Client beliebige Preise senden.
    const quantities = new Map();
    for (const it of items) {
      const dishId = it?.dishId;
      const qty = Number(it?.quantity);
      if (!dishId || !Number.isInteger(qty) || qty <= 0 || qty > 99) {
        return NextResponse.json({ message: "Ungültige Bestellposition" }, { status: 400 });
      }
      quantities.set(dishId, (quantities.get(dishId) ?? 0) + qty);
    }

    // Alle Gerichte laden, die wirklich zu diesem Restaurant gehören.
    const dishes = await prisma.dish.findMany({
      where: {
        id: { in: [...quantities.keys()] },
        category: {
          categoryGroup: {
            Menu: { restaurantId },
          },
        },
      },
      select: { id: true, name: true, price: true },
    });

    if (dishes.length !== quantities.size) {
      return NextResponse.json(
        { message: "Ein oder mehrere Gerichte gehören nicht zu diesem Restaurant" },
        { status: 400 }
      );
    }

    const orderItems = dishes.map((d) => ({
      dishId: d.id,
      name: d.name,
      price: Number(d.price),
      quantity: quantities.get(d.id),
    }));

    const order = await prisma.order.create({
      data: {
        restaurantId,
        tableNumber: String(tableNumber),
        items: orderItems,
        note: note ? String(note).slice(0, 500) : null,
        status: "pending",
      },
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}
