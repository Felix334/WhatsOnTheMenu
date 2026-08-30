import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { applyPriceChange, PRICE_MODES, ROUNDING_MODES } from "@/lib/priceRules";

/**
 * Preis-Massenänderung: passt alle Preise einer Kategorie oder der gesamten
 * Karte prozentual oder um einen Festbetrag an.
 *
 * Premium-Feature (Professional/Business) — Abo wird wie in calendarAuth.js
 * frisch aus der DB gelesen, nie aus dem JWT.
 */
export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const mode = body?.mode;
    const value = body?.value;
    const scope = body?.scope;
    const categoryId = body?.categoryId;
    const rounding = body?.rounding ?? "none";

    if (!PRICE_MODES.includes(mode)) {
      return NextResponse.json({ error: "Ungültiger Modus" }, { status: 400 });
    }
    if (!ROUNDING_MODES.includes(rounding)) {
      return NextResponse.json({ error: "Ungültige Rundung" }, { status: 400 });
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return NextResponse.json({ error: "Ungültiger Wert" }, { status: 400 });
    }
    // Grenzen verhindern, dass ein Vertipper (oder ein manipulierter Request)
    // die komplette Karte unbrauchbar macht.
    if (mode === "percent" && (value < -90 || value > 500)) {
      return NextResponse.json({ error: "Prozentwert muss zwischen -90 und +500 liegen" }, { status: 400 });
    }
    if (mode === "amount" && (value < -1000 || value > 1000)) {
      return NextResponse.json({ error: "Betrag muss zwischen -1000 und +1000 liegen" }, { status: 400 });
    }
    if (scope !== "all" && scope !== "category") {
      return NextResponse.json({ error: "Ungültiger Geltungsbereich" }, { status: 400 });
    }
    if (scope === "category" && typeof categoryId !== "string") {
      return NextResponse.json({ error: "categoryId erforderlich" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: token.id },
      select: { id: true, owner: { select: { subscription: true } } },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Kein Restaurant gefunden" }, { status: 404 });
    }
    if (!["Professional", "Business"].includes(restaurant.owner.subscription)) {
      return NextResponse.json({ error: "Preis-Massenänderung ist ein Premium-Feature" }, { status: 403 });
    }

    // Where-Filter immer über die Relationskette bis zum Restaurant — so kann
    // eine fremde categoryId nichts treffen.
    const where = {
      category: {
        ...(scope === "category" ? { id: categoryId } : {}),
        categoryGroup: { Menu: { restaurantId: restaurant.id } },
      },
    };

    const dishes = await prisma.dish.findMany({
      where,
      select: { id: true, price: true },
    });

    if (dishes.length === 0) {
      return NextResponse.json({ success: true, updated: 0 }, { status: 200 });
    }

    const updates = [];
    for (const dish of dishes) {
      const oldPrice = Number(dish.price);
      if (!Number.isFinite(oldPrice)) continue;

      const newPrice = applyPriceChange(oldPrice, mode, value, rounding);
      if (newPrice === null || newPrice === oldPrice) continue;

      updates.push(
        prisma.dish.update({
          where: { id: dish.id },
          data: { price: newPrice.toFixed(2) },
        }),
      );
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: true, updated: 0 }, { status: 200 });
    }

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, updated: updates.length }, { status: 200 });
  } catch (error) {
    console.error("bulkPrice API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
