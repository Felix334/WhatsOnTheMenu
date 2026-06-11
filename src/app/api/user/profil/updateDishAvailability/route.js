import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStaffAccess, can } from "@/lib/staffAuth";

export const dynamic = "force-dynamic";

export async function POST(req) {
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

    const access = await getStaffAccess(req, restaurantId);
    if (!access || !can(access, "availability")) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    // Prüfen ob das Gericht zum Restaurant gehört
    const dish = await prisma.dish.findFirst({
      where: {
        id: dishId,
        category: {
          categoryGroup: {
            Menu: { restaurantId },
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
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
