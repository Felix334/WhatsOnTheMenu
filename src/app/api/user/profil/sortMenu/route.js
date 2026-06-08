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

    const { groups, categories } = await req.json();

    const groupIds = groups.map((g) => g.id);
    const validGroups = await prisma.categoryGroup.findMany({
      where: {
        id: { in: groupIds },
        Menu: {
          restaurantId: restaurant.id,
        },
      },
      select: { id: true },
    });

    const categoryIds = categories.map((c) => c.id);
    const validCategories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        categoryGroup: {
          Menu: {
            restaurantId: restaurant.id,
          },
        },
      },
      select: { id: true },
    });

    if (validGroups.length === 0 && validCategories.length === 0) {
      return NextResponse.json({ error: "No valid items found" }, { status: 400 });
    }

    const validGroupIds = new Set(validGroups.map((g) => g.id));
    const validCategoryIds = new Set(validCategories.map((c) => c.id));

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
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sort API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
