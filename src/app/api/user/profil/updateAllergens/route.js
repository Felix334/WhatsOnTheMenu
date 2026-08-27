import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { isValidAllergenKey } from "@/lib/allergens";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Owner") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { dishId, restaurantId, allergens } = body;

    if (!dishId || !restaurantId) {
      return NextResponse.json(
        { error: "dishId und restaurantId sind erforderlich" },
        { status: 400 }
      );
    }

    const allergenList = Array.isArray(allergens) ? allergens : [];
    if (!allergenList.every(isValidAllergenKey)) {
      return NextResponse.json(
        { error: "Ungültiges Allergen übermittelt" },
        { status: 400 }
      );
    }

    const dish = await prisma.dish.findFirst({
      where: {
        id: dishId,
        category: {
          categoryGroup: {
            Menu: {
              restaurant: {
                id: restaurantId,
                ownerId: token.id,
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

    await prisma.dish.update({
      where: { id: dishId },
      data: { allergens: allergenList },
    });

    return NextResponse.json({ message: "Allergene erfolgreich aktualisiert" });
  } catch (error) {
    console.error("updateAllergens error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
