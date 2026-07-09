import { NextRequest, NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import { Restaurant, Menu, Category, Dish } from "@prisma/client";
import { devLog } from "src/lib/logger";
//import { webhookSecret } from "src/lib/stripe";

type MenuWithRelations = Menu & {
  categoryGroup: {
    id: string;
    categories: (Category & { dishes: Dish[] })[];
  }[];
};

export const dynamic = "force-dynamic";
interface ReceivedData {
  restaurantId: string;
  data: object;
}

async function safeDb<T>(callback: () => Promise<T>, context: string): Promise<T> {
  try {
    return await callback();
  } catch (err: any) {
    console.error(`❌ DB ERROR (${context}):`, err);
    throw new Error(`Database error in ${context}: ${err?.message ?? err}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    devLog("ServerSession2:", session);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "Owner") {
      return NextResponse.json({ message: "Nur Restaurant-Besitzer erlaubt" }, { status: 403 });
    }
    const recived_data: ReceivedData | null = await req.json().catch(() => null);
    devLog("reciver-check(/profil/edditData):", recived_data);

    if (!recived_data) {
      return NextResponse.json({ message: "Keine Daten vorhanden(Z49)" }, { status: 400 });
    }

    const { restaurantId, data } = recived_data;
    const userID = session.user.id;
    devLog("/edditData:", data);
    devLog(`List-Check: ${userID}, Restaurant-ID: ${restaurantId}, Daten: ${data},`);

    /* ---------------- PARSE JSON ---------------- */

    const parsedData = Array.isArray(data) ? data : [data];

    if (!Array.isArray(parsedData)) {
      devLog("Daten sind kein Array");
      return NextResponse.json({ message: "Daten müssen ein Array sein" }, { status: 400 });
    }

    /* ---------------- LOAD USER & RESTAURANT ---------------- */

    const user = await safeDb(() => prisma.user.findUnique({ where: { id: userID } }), "user.findUnique");
    const restaurant = (await safeDb(() => prisma.restaurant.findUnique({ where: { id: restaurantId } }), "restaurant.findUnique")) as Restaurant | null;

    if (!user || !restaurant) {
      return NextResponse.json({ message: "Ungültiger Benutzer oder Restaurant" }, { status: 404 });
    }

    if (restaurant.ownerId !== userID) {
      return NextResponse.json({ message: "Benutzer ist nicht Besitzer des Restaurants" }, { status: 403 });
    }

    /* ---------------- LOAD MENU ---------------- */

    const menu = (await safeDb(
      () =>
        prisma.menu.findFirst({
          where: { restaurantId },
          select: {
            id: true,
            name: true,
            description: true,
            bgColor: true,
            font: true,
            createdAt: true,
            updatedAt: true,
            restaurantId: true,
            categoryGroup: {
              select: {
                id: true,
                categories: {
                  include: {
                    dishes: {
                      include: {
                        ingredients: true,
                        reviews: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      "menu.findFirst",
    )) as MenuWithRelations | null;

    if (!menu) {
      return NextResponse.json({ message: "Kein Menü gefunden" }, { status: 404 });
    }

    const menuId = menu.id;

    // Flatten all categories across all category groups
    const categories = menu.categoryGroup.flatMap((group) => group.categories);

    // Use the first categoryGroup as default for new categories
    const defaultCategoryGroup = menu.categoryGroup[0];

    if (!defaultCategoryGroup) {
      return NextResponse.json({ message: "Keine Kategoriegruppe gefunden" }, { status: 404 });
    }

    for (const entry of parsedData) {
      if (!entry) continue;

      if (entry.type === "edditMenu") {
        const section = entry.section || {};
        const title = String(section.title ?? "").trim();
        if (!title) continue;

        const items: any[] = Array.isArray(section.items) ? section.items : [];

        let category = categories.find((c) => c.name === title);

        if (!category) {
          category = (await safeDb(
            () =>
              prisma.category.create({
                data: {
                  name: title,
                  description: section.description ?? null,
                  position: section.position ?? null,
                  // Use categroyGroupID (as per schema) instead of menuId
                  categoryGroupID: defaultCategoryGroup.id,
                },
                include: { dishes: true },
              }),
            "category.create",
          )) as Category & { dishes: Dish[] };

          categories.push(category);
        } else {
          await safeDb(
            () =>
              prisma.category.update({
                where: { id: category!.id },
                data: {
                  description: section.description ?? null,
                  position: section.position ?? null,
                },
              }),
            "category.update",
          );
        }

        if (!category) continue;

        for (const item of items) {
          if (!item || !item.name) continue;

          const price = String(item.price).replace(",", ".");

          const existingDish = category.dishes.find((d) => d.id === item.id);

          if (!existingDish) {
            const newDish = (await safeDb(
              () =>
                prisma.dish.create({
                  data: {
                    name: item.name,
                    description: item.description ?? null,
                    price,
                    imageUrl: item.image ?? "",
                    categoryId: category!.id,
                  },
                }),
              `dish.create (${item.name})`,
            )) as Dish;

            category.dishes.push(newDish);
          } else {
            await safeDb(
              () =>
                prisma.dish.update({
                  where: { id: existingDish.id },
                  data: {
                    name: item.name,
                    description: item.description ?? null,
                    price,
                  },
                }),
              `dish.update (${item.name})`,
            );
          }
        }
      }

      if (entry.type === "categoryUpdate") {
        const cat = entry.category || {};
        if (!cat.id) continue;
        // updateMany allows relation filter → scopes update to this restaurant's menu
        await safeDb(
          () =>
            prisma.category.updateMany({
              where: {
                id: cat.id,
                categoryGroup: { menuID: menuId },
              },
              data: {
                ...(cat.name !== undefined && { name: cat.name }),
                ...(cat.position !== undefined && { position: cat.position }),
                ...(cat.color !== undefined && { bgColor: cat.color || null }),
                ...(cat.fontColor !== undefined && { fontColor: cat.fontColor || null }),
                ...(cat.borderRadius !== undefined && { borderRadius: cat.borderRadius }),
                ...(cat.elevated !== undefined && { elevated: cat.elevated }),
                ...(cat.leaderDots !== undefined && { leaderDots: !!cat.leaderDots }),
                ...(cat.titleAlign !== undefined && ["left", "center", "right"].includes(cat.titleAlign) && { titleAlign: cat.titleAlign }),
                ...(cat.titleUppercase !== undefined && { titleUppercase: !!cat.titleUppercase }),
              },
            }),
          `category.updateMany (${cat.name || cat.id})`,
        );
      }
      if (entry.type === "switchPos") {
        const cat1 = entry.category.switch.cat1.id;
        const posCat1 = entry.category.switch.cat1.pos;
        const cat2 = entry.category.switch.cat2.id;
        const posCat2 = entry.category.switch.cat2.pos;
        if (cat1 && cat2) {
          await safeDb(
            () =>
              prisma.$transaction([
                prisma.category.updateMany({
                  where: { id: cat1, categoryGroup: { menuID: menuId } },
                  data: { position: posCat1 },
                }),
                prisma.category.updateMany({
                  where: { id: cat2, categoryGroup: { menuID: menuId } },
                  data: { position: posCat2 },
                }),
              ]),
            `category.updateMany (${cat1}, ${cat2})`,
          );
        }
      }
      if (entry.type === "updateCategoryGroupPos") {
        const catGroupID1 = entry.categoryGroup1.id;
        const catGroupID2 = entry.categoryGroup2.id;
        devLog("Update Positionen von categoriegruppen:", catGroupID1, catGroupID2);
        const oldPos = entry.categoryGroup.pos;
        const newPos = entry.categoryGroup2.pos;
        if (catGroupID1 && catGroupID2 && oldPos && newPos) {
          await safeDb(
            () =>
              prisma.$transaction([
                // menuID is a direct field on CategoryGroup → safe ownership scope
                prisma.categoryGroup.updateMany({
                  where: { id: catGroupID1, menuID: menuId },
                  data: { position: newPos },
                }),
                prisma.categoryGroup.updateMany({
                  where: { id: catGroupID2, menuID: menuId },
                  data: { position: newPos },
                }),
              ]),
            `categoryGroup.updateMany(${catGroupID1}, ${catGroupID2})`,
          );
        }
      }
      if (entry.type === "categoryGroupUpdate") {
        const catGroup = entry.categoryGroup || {};
        const catGroupID = catGroup.id;

        if (catGroupID) {
          const updateData: Record<string, unknown> = {};
          if (catGroup.name !== undefined) updateData.name = catGroup.name;
          if (catGroup.color !== undefined && catGroup.color) updateData.color = catGroup.color; // color ist required in DB
          if (catGroup.fontColor !== undefined) updateData.fontColor = catGroup.fontColor || null;
          if (catGroup.borderRadius !== undefined) updateData.borderRadius = catGroup.borderRadius;
          if (catGroup.titleAlign !== undefined && ["left", "center", "right"].includes(catGroup.titleAlign)) {
            updateData.titleAlign = catGroup.titleAlign;
          }

          if (Object.keys(updateData).length > 0) {
            await safeDb(
              () =>
                prisma.categoryGroup.updateMany({
                  where: { id: catGroupID, menuID: menuId },
                  data: updateData,
                }),
              `categoryGroup.updateMany(${catGroupID})`,
            );
          }
        }
      }
    }

    /* => Einbauen und testen
    async function applyPositionUpdates(
  updates: { itemId: string; oldPos: number; newPos: number }[],
  userId: string
) {
  // Validierung: oldPos stimmt wirklich mit DB überein?
  const ids = updates.map(u => u.itemId)
  const current = await prisma.item.findMany({
    where: { id: { in: ids }, userId }, // userId = Sicherheit!
    select: { id: true, position: true },
  })

  const invalid = updates.filter(u => {
    const dbItem = current.find(c => c.id === u.itemId)
    return !dbItem || dbItem.position !== u.oldPos
  })

  if (invalid.length > 0) {
    throw new Error('Position conflict – bitte Seite neu laden')
  }

  // Schreiben
  await prisma.$transaction(
    updates.map(({ itemId, newPos }) =>
      prisma.item.update({
        where: { id: itemId },
        data: { position: newPos },
      })
    )
  )
}
  */

    return NextResponse.json({ message: "Daten erfolgreich bearbeitet", restaurantId, menuId }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Serverfehler:", err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}
