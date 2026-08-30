import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/**
 * Verschiebt ein Gericht in eine andere Kategorie desselben Restaurants.
 * Eigene Route, weil setData/edditData Gerichte, deren categoryId nicht zur
 * Zielkategorie passt, bewusst überspringen (Schutz vor Fremdzugriff) — ein
 * Wechsel der Kategorie ist dort also nicht möglich.
 */
export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const dishId = body?.dishId;
    const targetCategoryId = body?.targetCategoryId;

    if (typeof dishId !== "string" || typeof targetCategoryId !== "string") {
      return NextResponse.json({ error: "dishId und targetCategoryId erforderlich" }, { status: 400 });
    }

    // Restaurant immer über den Token auflösen, nie über eine mitgeschickte ID —
    // sonst könnte ein fremdes restaurantId untergeschoben werden.
    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: token.id },
      select: { id: true },
    });
    if (!restaurant) {
      return NextResponse.json({ error: "Kein Restaurant gefunden" }, { status: 404 });
    }

    // Quelle und Ziel müssen beide zu diesem Restaurant gehören.
    const [dish, targetCategory] = await Promise.all([
      prisma.dish.findFirst({
        where: {
          id: dishId,
          category: { categoryGroup: { Menu: { restaurantId: restaurant.id } } },
        },
        select: { id: true, categoryId: true },
      }),
      prisma.category.findFirst({
        where: {
          id: targetCategoryId,
          categoryGroup: { Menu: { restaurantId: restaurant.id } },
        },
        select: { id: true },
      }),
    ]);

    if (!dish) {
      return NextResponse.json({ error: "Gericht nicht gefunden" }, { status: 404 });
    }
    if (!targetCategory) {
      return NextResponse.json({ error: "Zielkategorie nicht gefunden" }, { status: 404 });
    }
    if (dish.categoryId === targetCategory.id) {
      return NextResponse.json({ message: "Gericht ist bereits in dieser Kategorie" }, { status: 200 });
    }

    // Ans Ende der Zielkategorie hängen — keine bestehende Sortierung zerstören.
    const posAgg = await prisma.dish.aggregate({
      where: { categoryId: targetCategory.id },
      _max: { position: true },
    });

    await prisma.dish.update({
      where: { id: dish.id },
      data: {
        categoryId: targetCategory.id,
        position: (posAgg._max.position ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, categoryId: targetCategory.id }, { status: 200 });
  } catch (error) {
    console.error("moveDish API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
