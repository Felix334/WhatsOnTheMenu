import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/user/profil/updateDishAvailability
 * Body: { dishId: string, restaurantId: string, stock: "isAvailable" | "outOfStock" }
 *
 * Setzt den Verfügbarkeitsstatus eines Gerichts.
 * Nur der Besitzer des zugehörigen Restaurants darf ändern.
 */
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Owner") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { dishId, restaurantId, stock } = body;

    if (!dishId || !restaurantId) {
      return NextResponse.json(
        { error: "dishId und restaurantId sind erforderlich" },
        { status: 400 }
      );
    }

    if (stock !== "isAvailable" && stock !== "outOfStock") {
      return NextResponse.json(
        { error: "Ungültiger stock-Wert. Erlaubt: isAvailable | outOfStock" },
        { status: 400 }
      );
    }

    // Prüfen ob das Gericht zum Restaurant des eingeloggten Users gehört
    const dish = await prisma.dish.findFirst({
      where: {
        id: dishId,
        category: {
          categoryGroup: {
            Menu: {
              restaurant: {
                id: restaurantId,
                ownerId: session.user.id,
              },
            },
          },
        },
      },
    });

    if (!dish) {
      return NextResponse.json(
        { error: "Gericht nicht gefunden oder keine Berechtigung" },
        { status: 404 }
      );
    }

    const updated = await prisma.dish.update({
      where: { id: dishId },
      data: { stock },
      select: { id: true, stock: true },
    });

    return NextResponse.json({
      message: "Verfügbarkeit aktualisiert",
      dish: updated,
    });
  } catch (error) {
    console.error("updateDishAvailability error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler", details: error.message },
      { status: 500 }
    );
  }
}
