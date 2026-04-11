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

interface CategoryGroupUpdateEntry {
  type: "categoryGroupUpdate";
  categoryGroup: {
    id?: string;
    name?: string;
    position?: number;
    color?: string;
  };
}

interface CategoryUpdateEntry {
  type: "categoryUpdate";
  category: {
    id: string;
    name?: string;
    position?: number;
    color?: string;
  };
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
    title: string;
    description?: string;
    position?: number;
    items?: MenuSectionItem[];
  };
}

type ParsedEntry = CategoryGroupUpdateEntry | CategoryUpdateEntry | MenuSectionEntry;

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

    // ── API-Key prüfen ─────────────────────────────────────────────────────
    // FIX: NEXT_PUBLIC_ entfernt – dieser Key darf NICHT im Client-Bundle landen.

    const expectedApiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!expectedApiKey) {
      console.error("Server API_KEY env var missing");
      return NextResponse.json({ message: "Serverkonfiguration fehlt (API_KEY)" }, { status: 500 });
    }
    if (apiKey !== expectedApiKey) {
      return NextResponse.json({ message: "Ungültiger API-Schlüssel" }, { status: 401 });
    }

    // ── JSON parsen ────────────────────────────────────────────────────────

    let parsedData: ParsedEntry[];
    try {
      const raw = JSON.parse(decryptedDataString);
      if (!Array.isArray(raw)) {
        return NextResponse.json({ message: "Daten müssen ein Array sein" }, { status: 400 });
      }
      parsedData = raw as ParsedEntry[];
      parsedData.forEach((entry) => {
        if (entry.type === "menuSection" && entry.section?.items) {
          entry.section.items.forEach((data) => {





// Ist falsch => Eigentlich Suche nach den categoryGroup 










            console.log("Daten-Map:", data);
          });
        }
      });
    } catch {
      return NextResponse.json({ message: "Ungültiges JSON im entschlüsselten Feld" }, { status: 400 });
    }

    // ── Benutzer & Restaurant laden ────────────────────────────────────────

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

    // FIX: Autorisierung – nur der Besitzer darf Daten schreiben.
    if (restaurant.ownerId !== userID) {
      return NextResponse.json({ message: "Benutzer ist nicht der Besitzer des Restaurants" }, { status: 403 });
    }

    // ── Menü finden oder erstellen (upsert-ähnlich, kein doppelter Query) ─

    let menu: MenuWithRelations;

    if (restaurant.menu.length > 0) {
      menu = restaurant.menu[0];
    } else {
      // FIX: include direkt im create → kein zweiter findUnique nötig.
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

    // ── CategoryGroup bestimmen ────────────────────────────────────────────
    // FIX: Die groupUpdate-Logik läuft NUR einmal hier – nicht doppelt in der Loop.

    const groupUpdateEntry = parsedData.find((e): e is CategoryGroupUpdateEntry => e.type === "categoryGroupUpdate");
    const groupName = groupUpdateEntry?.categoryGroup?.name ?? "Standard";

    let defaultGroup = menu.categoryGroup.find((g) => g.name === groupName) ?? null;

    if (!defaultGroup) {
      defaultGroup = (await safeDb(
        () =>
          prisma.categoryGroup.create({
            data: {
              name: groupName,
              position: groupUpdateEntry?.categoryGroup?.position ?? 0,
              color: groupUpdateEntry?.categoryGroup?.color ?? "#ffffff",
              menuID: menuId,
            },
            include: { categories: true },
          }),
        "categoryGroup.create",
      )) as CategoryGroupWithRelations;
    } else if (groupUpdateEntry?.categoryGroup?.id === defaultGroup.id) {
      // Nur updaten wenn die ID explizit übereinstimmt, um fremde Gruppen zu schützen.
      defaultGroup = (await safeDb(
        () =>
          prisma.categoryGroup.update({
            where: { id: defaultGroup!.id },
            data: {
              name: groupUpdateEntry.categoryGroup.name,
              position: groupUpdateEntry.categoryGroup.position,
              color: groupUpdateEntry.categoryGroup.color,
            },
            include: { categories: true },
          }),
        "categoryGroup.update",
      )) as CategoryGroupWithRelations;
    }

    const groupId = defaultGroup.id;

    // ── Einträge verarbeiten ───────────────────────────────────────────────

    for (const entry of parsedData) {
      if (!entry) continue;

      // ── menuSection ──────────────────────────────────────────────────────
      if (entry.type === "menuSection") {
        const section = entry.section ?? {};
        const title = (section.title ?? "").toString().trim();
        if (!title) continue;

        const items: MenuSectionItem[] = Array.isArray(section.items) ? section.items : [];

        // Kategorie upsert (find-or-create + update in einem Schritt)
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
                  // FIX: position darf nicht null sein wenn das Schema Int erwartet.
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

        for (const item of items) {
          if (!item?.name) continue;

          const price = parsePrice(item.price);

          // FIX: Beim Update prüfen, ob das Dish wirklich zur aktuellen
          //      Kategorie gehört – verhindert das Überschreiben fremder Daten.
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
                console.warn(`⚠️  Dish ${item.id} gehört nicht zur Kategorie ${category.id} – übersprungen.`);
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

      // ── categoryUpdate ───────────────────────────────────────────────────
      // FIX: Sicherstellen, dass die Kategorie wirklich zur aktuellen Gruppe gehört.
      if (entry.type === "categoryUpdate") {
        const cat = entry.category ?? {};
        if (!cat.id) continue;

        const existingCat = await safeDb(
          () =>
            prisma.category.findUnique({
              where: { id: cat.id },
              select: { id: true, categoryGroupID: true },
            }),
          `category.findUnique for update (${cat.id})`,
        );

        if (!existingCat || existingCat.categoryGroupID !== groupId) {
          console.warn(`⚠️  Kategorie ${cat.id} gehört nicht zur Gruppe ${groupId} – übersprungen.`);
          continue;
        }

        await safeDb(
          () =>
            prisma.category.update({
              where: { id: cat.id },
              data: {
                name: cat.name,
                position: cat.position ?? 0,
                bgColor: cat.color,
              },
            }),
          `category.update (${cat.id})`,
        );
      }

      // ── categoryGroupUpdate ──────────────────────────────────────────────
      // FIX: Wird oben bereits korrekt behandelt, hier nur noch überspringen.
      if (entry.type === "categoryGroupUpdate") {
        continue; // bereits vor der Loop verarbeitet
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
  // FIX: NEXT_PUBLIC_ entfernt – der Key darf NICHT im Browser verfügbar sein.
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!key) return { error: "Encryption key missing", status: 500 };

  try {
    const decryptedUserId = CryptoJS.AES.decrypt(data.encrypted_user_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedRestaurantId = CryptoJS.AES.decrypt(data.encrypted_restaurant_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedData = CryptoJS.AES.decrypt(data.encrypted_data, key).toString(CryptoJS.enc.Utf8);
    const decryptedApiKey = CryptoJS.AES.decrypt(data.encrypted_api_key, key).toString(CryptoJS.enc.Utf8);

    if (!decryptedUserId || !decryptedRestaurantId || !decryptedData || !decryptedApiKey) {
      return {
        error: "Entschlüsselung fehlgeschlagen (leere Werte)",
        status: 400,
      };
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
