import { NextRequest, NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import * as CryptoJS from "crypto-js";
import { Restaurant, User, Menu as PrismaMenu, Category as PrismaCategory, CategoryGroup as PrismaCategoryGroup } from "@prisma/client";

export const dynamic = "force-dynamic";

// ─── Typen ───────────────────────────────────────────────────────────────────

type CategoryGroupWithRelations = PrismaCategoryGroup & {
  categories: PrismaCategory[];
};
type MenuWithRelations = PrismaMenu & {
  categoryGroup: CategoryGroupWithRelations[];
};

interface EncryptedData {
  encrypted_user_id: string;
  encrypted_restaurant_id: string;
  encrypted_data: string;
  encrypted_api_key: string;
}

interface MenuSectionItem {
  id?: string;
  name: string;
  description?: string;
  price?: number | string;
  image?: string;
}

interface MenuSectionEntry {
  type: "menuSection";
  section: {
    categoryGroup: string;   // z.B. "Frühstück"
    title: string;           // z.B. "Müsli"
    description?: string;
    position?: number;
    items?: MenuSectionItem[];
  };
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

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

async function safeDb<T>(callback: () => Promise<T>, context: string): Promise<T> {
  try {
    return await callback();
  } catch (err) {
    console.error(`❌ DATABASE ERROR in ${context}:`, err);
    throw new Error(`Database error in ${context}: ${(err as any).message ?? err}`);
  }
}

function parsePrice(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const p = parseFloat(raw.replace(",", ".").replace(/[^\d.-]/g, ""));
    if (Number.isFinite(p)) return p;
  }
  return 0;
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

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
    console.log("Data-Check1:", decryptedDataString);

    // ── API-Key prüfen ────────────────────────────────────────────────────
    const expectedApiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!expectedApiKey) {
      return NextResponse.json({ message: "Serverkonfiguration fehlt (API_KEY)" }, { status: 500 });
    }
    if (apiKey !== expectedApiKey) {
      return NextResponse.json({ message: "Ungültiger API-Schlüssel" }, { status: 401 });
    }

    // ── JSON parsen ───────────────────────────────────────────────────────
    let parsedData: MenuSectionEntry[];
    try {
      const raw = JSON.parse(decryptedDataString);
      if (!Array.isArray(raw)) {
        return NextResponse.json({ message: "Daten müssen ein Array sein" }, { status: 400 });
      }
      // Nur menuSection-Einträge durchlassen
      parsedData = (raw as any[]).filter((e) => e?.type === "menuSection") as MenuSectionEntry[];
      console.log("Datenblock-Check2:", parsedData);
    } catch {
      return NextResponse.json({ message: "Ungültiges JSON im entschlüsselten Feld" }, { status: 400 });
    }

    if (parsedData.length === 0) {
      return NextResponse.json({ message: "Keine menuSection-Einträge gefunden" }, { status: 400 });
    }

    // ── Benutzer & Restaurant laden ───────────────────────────────────────
    const [user, restaurant] = await Promise.all([
      safeDb(() => prisma.user.findUnique({ where: { id: userID } }), "user.findUnique") as Promise<User | null>,
      safeDb(
        () =>
          prisma.restaurant.findUnique({
            where: { id: restaurantId },
            include: {
              menu: {
                include: {
                  categoryGroup: { include: { categories: true } },
                },
              },
            },
          }),
        "restaurant.findUnique",
      ) as Promise<(Restaurant & { menu: MenuWithRelations[] }) | null>,
    ]);

    if (!user || !restaurant) {
      return NextResponse.json({ message: "Ungültiger Benutzer oder Restaurant" }, { status: 404 });
    }

    if (restaurant.ownerId !== userID) {
      return NextResponse.json({ message: "Benutzer ist nicht der Besitzer des Restaurants" }, { status: 403 });
    }

    // ── Menü finden oder erstellen ────────────────────────────────────────
    let menu: MenuWithRelations;

    if (restaurant.menu.length > 0) {
      menu = restaurant.menu[0];
    } else {
      menu = (await safeDb(
        () =>
          prisma.menu.create({
            data: {
              name: `Menü für ${restaurant.name}`,
              description: null,
              restaurantId,
              bgColor: "#ffffff",
              font: "Arial",
            },
            include: {
              categoryGroup: { include: { categories: true } },
            },
          }),
        "menu.create",
      )) as MenuWithRelations;
    }

    const menuId = menu.id;

    // ── Einträge verarbeiten ──────────────────────────────────────────────
    for (const entry of parsedData) {
      const section = entry.section;
      const title = (section.title ?? "").toString().trim();
      const groupName = (section.categoryGroup ?? "Standard").toString().trim();
      const items: MenuSectionItem[] = Array.isArray(section.items) ? section.items : [];

      if (!title || !groupName) continue;

      // ── CategoryGroup finden oder erstellen ───────────────────────────
      let group = menu.categoryGroup.find((g) => g.name === groupName) ?? null;

      if (!group) {
        group = (await safeDb(
          () =>
            prisma.categoryGroup.create({
              data: {
                name: groupName,
                position: 0,
                color: "#ffffff",
                menuID: menuId,
              },
              include: { categories: true },
            }),
          "categoryGroup.create",
        )) as CategoryGroupWithRelations;

        // Lokalen Cache aktualisieren → verhindert doppelte Gruppen
        menu.categoryGroup.push(group);
      }

      const groupId = group.id;

      // ── Category finden oder erstellen ────────────────────────────────
      let category = (await safeDb(
        () =>
          prisma.category.findFirst({
            where: { categoryGroupID: groupId, name: title },
          }),
        "category.findFirst",
      )) as PrismaCategory | null;

      if (!category) {
        category = (await safeDb(
          () =>
            prisma.category.create({
              data: {
                name: title,
                description: section.description ?? null,
                position: section.position ?? 0,
                categoryGroupID: groupId,
              },
            }),
          "category.create",
        )) as PrismaCategory;
      } else {
        category = (await safeDb(
          () =>
            prisma.category.update({
              where: { id: category!.id },
              data: {
                description: section.description ?? null,
                position: section.position ?? 0,
              },
            }),
          "category.update",
        )) as PrismaCategory;
      }

      // ── Dishes verarbeiten ────────────────────────────────────────────
      for (const item of items) {
        if (!item?.name) continue;

        const price = parsePrice(item.price);

        if (item.id) {
          const existingDish = await safeDb(
            () =>
              prisma.dish.findUnique({
                where: { id: item.id },
                select: { id: true, categoryId: true },
              }),
            `dish.findUnique (${item.name})`,
          );

          if (existingDish) {
            if (existingDish.categoryId !== category.id) {
              console.warn(`⚠️ Dish ${item.id} gehört nicht zur Kategorie ${category.id} – übersprungen.`);
              continue;
            }

            await safeDb(
              () =>
                prisma.dish.update({
                  where: { id: item.id },
                  data: {
                    name: item.name,
                    description: item.description ?? null,
                    price,
                    imageUrl: item.image ?? null,
                  },
                }),
              `dish.update (${item.name})`,
            );
            continue;
          }
        }

        await safeDb(
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
        );
      }
    }

    return NextResponse.json({ message: "Daten erfolgreich verarbeitet", restaurantId, menuId }, { status: 200 });
  } catch (err: any) {
    console.error("Error in POST handler:", err);
    return NextResponse.json({ message: "Serverfehler", error: err?.message ?? err }, { status: 500 });
  }
}

// ─── Decrypt ─────────────────────────────────────────────────────────────────

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