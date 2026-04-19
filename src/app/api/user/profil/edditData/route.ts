import { NextRequest, NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import * as CryptoJS from "crypto-js";
import { Restaurant, Menu, Category, Dish } from "@prisma/client";

type MenuWithRelations = Menu & {
  categoryGroup: {
    id: string;
    categories: (Category & { dishes: Dish[] })[];
  }[];
};

export const dynamic = "force-dynamic";

interface EncryptedData {
  encrypted_user_id: string;
  encrypted_restaurant_id: string;
  encrypted_data: string;
  encrypted_api_key: string;
}

type SuccessResponse = {
  status: number;
  userID: string;
  restaurantId: string;
  data: string;
  apiKey: string;
};

type ErrorResponse = { error: string; status: number };
type DecryptResult = SuccessResponse | ErrorResponse | null;

function isSuccess(r: DecryptResult): r is SuccessResponse {
  return !!r && "userID" in r;
}

function isError(r: DecryptResult): r is ErrorResponse {
  return !!r && "error" in r;
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
    console.log("ServerSession2:", session);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "Owner") {
      return NextResponse.json({ message: "Nur Restaurant-Besitzer erlaubt" }, { status: 403 });
    }

    const encryptedData: EncryptedData | null = await req.json().catch(() => null);

    if (!encryptedData) {
      return NextResponse.json({ message: "Keine Daten vorhanden" }, { status: 400 });
    }

    const decryptResult = await decryption(encryptedData);
    console.log("/edditData:", decryptResult);

    if (isError(decryptResult)) {
      console.log("Keine Daten vorhanden");
      return NextResponse.json({ message: decryptResult.error }, { status: decryptResult.status });
    }

    if (!isSuccess(decryptResult)) {
      return NextResponse.json({ message: "Unbekannter Entschlüsselungsfehler" }, { status: 500 });
    }

    const { userID, restaurantId, data: decryptedDataString, apiKey } = decryptResult;
    const expectedApiKey = process.env.NEXT_PUBLIC_API_KEY;
    console.log(`List-Check: ${userID}, Restaurant-ID: ${restaurantId}, Daten: ${decryptResult}, API-KEY ${apiKey}`);

    if (!expectedApiKey) {
      return NextResponse.json({ message: "Serverkonfiguration fehlt (API_KEY)" }, { status: 500 });
    }

    if (apiKey !== expectedApiKey) {
      return NextResponse.json({ message: "Ungültiger API-Schlüssel" }, { status: 401 });
    }

    /* ---------------- PARSE JSON ---------------- */

    let parsedData: any;

    try {
      parsedData = JSON.parse(decryptedDataString);
    } catch {
      return NextResponse.json({ message: "Ungültiges JSON Format" }, { status: 400 });
    }

    if (!Array.isArray(parsedData)) {
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
                    imageUrl: item.image ?? null,
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

        await safeDb(
          () =>
            prisma.category.update({
              where: { id: cat.id },
              data: {
                name: cat.name,
                position: cat.position,
                bgColor: cat.color,
              },
            }),
          `category.update (${cat.name})`,
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
                prisma.category.update({
                  where: { id: cat1 },
                  data: {
                    position: posCat1,
                  },
                }),
                prisma.category.update({
                  where: { id: cat2 },
                  data: {
                    position: posCat2,
                  },
                }),
              ]), // ✅ Komma hier
            `category.update (${cat1}, ${cat2})`,
          );
        }
      }
    }

    return NextResponse.json({ message: "Daten erfolgreich bearbeitet", restaurantId, menuId }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Serverfehler:", err);
    return NextResponse.json({ message: "Serverfehler", error: err?.message ?? err }, { status: 500 });
  }
}

/* ---------------- DECRYPT FUNCTION ---------------- */

async function decryption(data: EncryptedData): Promise<DecryptResult> {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  if (!key) return { error: "Encryption key missing", status: 500 };

  try {
    const decryptedUserId = CryptoJS.AES.decrypt(data.encrypted_user_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedRestaurantId = CryptoJS.AES.decrypt(data.encrypted_restaurant_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedData = CryptoJS.AES.decrypt(data.encrypted_data, key).toString(CryptoJS.enc.Utf8);
    const decryptedApiKey = CryptoJS.AES.decrypt(data.encrypted_api_key, key).toString(CryptoJS.enc.Utf8);

    if (!decryptedUserId || !decryptedRestaurantId || !decryptedData || !decryptedApiKey) {
      return { error: "Entschlüsselung fehlgeschlagen", status: 400 };
    }

    return {
      userID: decryptedUserId,
      restaurantId: decryptedRestaurantId,
      data: decryptedData,
      apiKey: decryptedApiKey,
      status: 200,
    };
  } catch {
    return { error: "Decryption failed", status: 400 };
  }
}
