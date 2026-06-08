import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

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

    const toDisconnect = dish.ingredients.filter(
      (i) => !allergenList.includes(i.name)
    );

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
