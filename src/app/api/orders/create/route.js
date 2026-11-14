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

    if (!Array.isArray(items) || items.length > 100) {
      return NextResponse.json({ message: "Ungültige Bestellung" }, { status: 400 });
    }

    // Nur dishId, variantId + Menge aus dem Request übernehmen. Preis und Name
    // kommen ausschließlich aus der DB – sonst könnte der Client beliebige Preise senden.
    const positions = new Map(); // "dishId|variantId" → { dishId, variantId, quantity }
    for (const it of items) {
      const dishId = it?.dishId;
      const variantId = it?.variantId ?? null;
      const qty = Number(it?.quantity);
      if (typeof dishId !== "string" || !dishId || (variantId !== null && typeof variantId !== "string") || !Number.isInteger(qty) || qty <= 0 || qty > 99) {
        return NextResponse.json({ message: "Ungültige Bestellposition" }, { status: 400 });
      }
      const key = `${dishId}|${variantId ?? ""}`;
      const prev = positions.get(key);
      positions.set(key, { dishId, variantId, quantity: (prev?.quantity ?? 0) + qty });
    }

    const dishIds = [...new Set([...positions.values()].map((p) => p.dishId))];

    // Alle Gerichte laden, die wirklich zu diesem Restaurant gehören.
    const dishes = await prisma.dish.findMany({
      where: {
        id: { in: dishIds },
        category: {
          categoryGroup: {
            Menu: { restaurantId },
          },
        },
      },
      select: { id: true, name: true, price: true, variants: { select: { id: true, label: true, price: true } } },
    });

    if (dishes.length !== dishIds.length) {
      return NextResponse.json(
        { message: "Ein oder mehrere Gerichte gehören nicht zu diesem Restaurant" },
        { status: 400 }
      );
    }

    const dishById = new Map(dishes.map((d) => [d.id, d]));
    const orderItems = [];
    for (const { dishId, variantId, quantity } of positions.values()) {
      const dish = dishById.get(dishId);

      // Hat ein Gericht Varianten, muss genau eine davon gewählt sein — sonst
      // wäre unklar, welche Größe (und welcher Preis) gemeint ist.
      if (dish.variants.length > 0) {
        const variant = dish.variants.find((v) => v.id === variantId);
        if (!variant) {
          return NextResponse.json({ message: `Bitte eine Größe für „${dish.name}“ wählen` }, { status: 400 });
        }
        orderItems.push({ dishId, variantId, name: `${dish.name} (${variant.label})`, price: Number(variant.price), quantity });
      } else {
        if (variantId !== null) {
          return NextResponse.json({ message: "Ungültige Bestellposition" }, { status: 400 });
        }
        orderItems.push({ dishId, name: dish.name, price: Number(dish.price), quantity });
      }
    }

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
