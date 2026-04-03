import { NextRequest, NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import * as CryptoJS from "crypto-js";
import { Restaurant, User, Menu as PrismaMenu, Category as PrismaCategory, CategoryGroup as PrismaCategoryGroup } from "@prisma/client";

type CategoryGroupWithRelations = PrismaCategoryGroup & { categories: PrismaCategory[] };
type MenuWithRelations = PrismaMenu & { categoryGroup: CategoryGroupWithRelations[] };

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
  } catch (err) {
    console.error(`❌ DATABASE ERROR in ${context}:`, err);
    throw new Error(`Database error in ${context}: ${(err as any).message || err}`);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const encryptedData: EncryptedData | null = await req.json().catch(() => null);

    if (!encryptedData) {
      return NextResponse.json({ message: "Keine Daten empfangen" }, { status: 400 });
    }

    const decryptResult = await decryption(encryptedData);
    if (isError(decryptResult)) {
      return NextResponse.json({ message: decryptResult.error }, { status: decryptResult.status });
    }
    if (!isSuccess(decryptResult)) {
      return NextResponse.json({ message: "Unbekannter Entschlüsselungsfehler" }, { status: 500 });
    }

    const { userID, restaurantId, data: decryptedDataString, apiKey } = decryptResult;

    const expectedApiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!expectedApiKey) {
      console.error("Server API_KEY env var missing");
      return NextResponse.json({ message: "Serverkonfiguration fehlt (API_KEY)" }, { status: 500 });
    }
    if (apiKey !== expectedApiKey) {
      return NextResponse.json({ message: "Ungültiger API-Schlüssel" }, { status: 401 });
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(decryptedDataString);
      console.log("Empfangene Daten:", parsedData);
    } catch {
      return NextResponse.json({ message: "Ungültiges JSON im entschlüsselten Feld" }, { status: 400 });
    }

    if (!Array.isArray(parsedData)) {
      return NextResponse.json({ message: "Daten müssen ein Array sein" }, { status: 400 });
    }

    const user = await safeDb(
      () => prisma.user.findUnique({ where: { id: userID } }),
      "user.findUnique"
    ) as User | null;

    const restaurant = await safeDb(
      () => prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: {
          menu: {
            include: {
              categoryGroup: {
                include: {
                  categories: true,
                },
              },
            },
          },
        },
      }),
      "restaurant.findUnique"
    ) as (Restaurant & { menu: MenuWithRelations[] }) | null;

    if (!user || !restaurant) {
      return NextResponse.json({ message: "Ungültiger Benutzer oder Restaurant" }, { status: 404 });
    }

    if (restaurant.ownerId !== userID) {
      return NextResponse.json({ message: "Benutzer ist nicht der Besitzer des Restaurants" }, { status: 403 });
    }

    // Erstes Menü nehmen oder neu erstellen
    let menu: MenuWithRelations | null = restaurant.menu.length > 0 ? restaurant.menu[0] : null;

    if (!menu) {
      const createdMenu = await safeDb(
        () => prisma.menu.create({
          data: {
            name: `Menü für ${restaurant.name}`,
            description: null,
            restaurantId: restaurantId,
            bgColor: "#ffffff",
            font: "Arial",
          },
        }),
        "menu.create"
      );

      menu = await safeDb(
        () => prisma.menu.findUnique({
          where: { id: createdMenu.id },
          include: {
            categoryGroup: {
              include: {
                categories: true,
              },
            },
          },
        }),
        "menu.findUnique after create"
      ) as MenuWithRelations;
    }

    const menuId = menu.id;

    // Standard CategoryGroup finden oder erstellen
    let defaultGroup: CategoryGroupWithRelations | null =
      menu.categoryGroup.length > 0 ? menu.categoryGroup[0] : null;

    if (!defaultGroup) {
      const createdGroup = await safeDb(
        () => prisma.categoryGroup.create({
          data: {
            name: "Standard",
            position: 0,
            color: "#ffffff",
            menuID: menuId,
          },
        }),
        "categoryGroup.create"
      );

      defaultGroup = await safeDb(
        () => prisma.categoryGroup.findUnique({
          where: { id: createdGroup.id },
          include: { categories: true },
        }),
        "categoryGroup.findUnique after create"
      ) as CategoryGroupWithRelations;
    }

    const groupId = defaultGroup.id;

    // Einträge verarbeiten
    for (const entry of parsedData) {
      if (!entry || entry.type !== "menuSection") continue;

      const section = entry.section ?? {};
      const title = (section.title ?? "").toString().trim();
      if (!title) continue;

      const items: any[] = Array.isArray(section.items) ? section.items : [];

      // Kategorie in der CategoryGroup suchen oder erstellen
      let category = await safeDb(
        () => prisma.category.findFirst({
          where: { categroyGroupID: groupId, name: title },
        }),
        "category.findFirst"
      ) as PrismaCategory | null;

      if (!category) {
        category = await safeDb(
          () => prisma.category.create({
            data: {
              name: title,
              description: null,
              position: null,
              categroyGroupID: groupId,
            },
          }),
          "category.create"
        ) as PrismaCategory;
      }

      // Gerichte erstellen
      for (const item of items) {
        if (!item || !item.name) continue;

        let price = 0;
        if (typeof item.price === "number") {
          price = item.price;
        } else if (typeof item.price === "string") {
          const p = parseFloat(item.price.replace(",", ".").replace(/[^\d.-]/g, ""));
          price = Number.isFinite(p) ? p : 0;
        }

        await safeDb(
          () => prisma.dish.create({
            data: {
              name: item.name,
              description: item.description ?? null,
              price,
              imageUrl: item.image ?? "",
              categoryId: category!.id,
            },
          }),
          `dish.create (${item.name})`
        );
      }
    }

    return NextResponse.json(
      { message: "Daten erfolgreich verarbeitet", restaurantId, menuId },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Error in POST handler:", err);
    return NextResponse.json(
      { message: "Serverfehler", error: err?.message ?? err },
      { status: 500 }
    );
  }
}

async function decryption(data: EncryptedData): Promise<DecryptResult> {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!key) return { error: "Encryption key missing", status: 500 };

  try {
    const decryptedUserId = CryptoJS.AES.decrypt(data.encrypted_user_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedRestaurantId = CryptoJS.AES.decrypt(data.encrypted_restaurant_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedData = CryptoJS.AES.decrypt(data.encrypted_data, key).toString(CryptoJS.enc.Utf8);
    const decryptedApiKey = CryptoJS.AES.decrypt(data.encrypted_api_key, key).toString(CryptoJS.enc.Utf8);

    if (!decryptedUserId || !decryptedRestaurantId || !decryptedData || !decryptedApiKey) {
      return { error: "Entschlüsselung fehlgeschlagen (leere Werte)", status: 400 };
    }

    return {
      userID: decryptedUserId,
      restaurantId: decryptedRestaurantId,
      data: decryptedData,
      apiKey: decryptedApiKey,
      status: 200,
    };
  } catch (e) {
    console.error("Decryption error:", e);
    return { error: "Decryption failed", status: 400 };
  }
}