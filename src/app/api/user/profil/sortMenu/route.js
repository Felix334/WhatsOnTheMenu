import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "Owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: token.id },
      select: { id: true },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Unauthorized- Kein Restaurant gefunden" }, { status: 401 });
    }

    const body = await req.json();
    // Alle drei Ebenen sind optional — der Client schickt nur, was verschoben wurde.
    const groups = Array.isArray(body?.groups) ? body.groups : [];
    const categories = Array.isArray(body?.categories) ? body.categories : [];
    const dishes = Array.isArray(body?.dishes) ? body.dishes : [];

    // Positionen müssen ganzzahlig und nicht-negativ sein — sonst schreibt ein
    // manipulierter Request beliebige Werte in die Sortierspalten.
    const isValidEntry = (e) => typeof e?.id === "string" && Number.isInteger(e?.position) && e.position >= 0;
    if (![...groups, ...categories, ...dishes].every(isValidEntry)) {
      return NextResponse.json({ error: "Ungültige Sortierdaten" }, { status: 400 });
    }

    const [validGroups, validCategories, validDishes] = await Promise.all([
      groups.length
        ? prisma.categoryGroup.findMany({
            where: {
              id: { in: groups.map((g) => g.id) },
              Menu: { restaurantId: restaurant.id },
            },
            select: { id: true },
          })
        : [],
      categories.length
        ? prisma.category.findMany({
            where: {
              id: { in: categories.map((c) => c.id) },
              categoryGroup: { Menu: { restaurantId: restaurant.id } },
            },
            select: { id: true },
          })
        : [],
      dishes.length
        ? prisma.dish.findMany({
            where: {
              id: { in: dishes.map((d) => d.id) },
              category: { categoryGroup: { Menu: { restaurantId: restaurant.id } } },
            },
            select: { id: true },
          })
        : [],
    ]);

    if (validGroups.length === 0 && validCategories.length === 0 && validDishes.length === 0) {
      return NextResponse.json({ error: "No valid items found" }, { status: 400 });
    }

    const validGroupIds = new Set(validGroups.map((g) => g.id));
    const validCategoryIds = new Set(validCategories.map((c) => c.id));
    const validDishIds = new Set(validDishes.map((d) => d.id));

    await prisma.$transaction([
      ...groups
        .filter((g) => validGroupIds.has(g.id))
        .map((g) =>
          prisma.categoryGroup.update({
            where: { id: g.id },
            data: { position: g.position },
          })
        ),
      ...categories
        .filter((c) => validCategoryIds.has(c.id))
        .map((c) =>
          prisma.category.update({
            where: { id: c.id },
            data: { position: c.position },
          })
        ),
      ...dishes
        .filter((d) => validDishIds.has(d.id))
        .map((d) =>
          prisma.dish.update({
            where: { id: d.id },
            data: { position: d.position },
          })
        ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sort API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
