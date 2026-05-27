import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/user/profil/updateAllergens
 * Body: { dishId: string, restaurantId: string, allergens: string[] }
 *
 * Setzt die Allergene für ein Gericht neu (vorherige werden ersetzt).
 * Allergen-Namen entsprechen den 14 EU-Hauptallergenen (z. B. "Gluten", "Milch").
 */
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Owner") {
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
      include: {
        ingredients: {
          where: { isAllergen: true },
        },
      },
    });

    if (!dish) {
      return NextResponse.json(
        { error: "Gericht nicht gefunden oder keine Berechtigung" },
        { status: 404 }
      );
    }

    // Für jeden gewählten Allergennamen: existierenden Eintrag finden oder neu anlegen
    const newIngredients = await Promise.all(
      allergenList.map(async (name) => {
        let ingredient = await prisma.ingredient.findFirst({
          where: { name, isAllergen: true },
        });
        if (!ingredient) {
          ingredient = await prisma.ingredient.create({
            data: { name, isAllergen: true },
          });
        }
        return ingredient;
      })
    );

    // Alte Allergen-Zutaten bestimmen, die nicht mehr gewählt sind
    const toDisconnect = dish.ingredients.filter(
      (i) => !allergenList.includes(i.name)
    );

    // Gericht aktualisieren: entfernen + verbinden
    await prisma.dish.update({
      where: { id: dishId },
      data: {
        ingredients: {
          disconnect: toDisconnect.map((i) => ({ id: i.id })),
          connect: newIngredients.map((i) => ({ id: i.id })),
        },
      },
    });

    return NextResponse.json({ message: "Allergene erfolgreich aktualisiert" });
  } catch (error) {
    console.error("updateAllergens error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler", details: error.message },
      { status: 500 }
    );
  }
}
