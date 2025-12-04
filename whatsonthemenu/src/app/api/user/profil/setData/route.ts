import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as CryptoJS from "crypto-js";

const prisma = new PrismaClient();

interface EncryptedData {
  encrypted_user_id: string;
  encrypted_restaurant_id: string;
  encrypted_data: string;
  encrypted_api_key: string;
}

type Response =
  | { status: number; userID: string; restaurantId: string; data: any; apiKey: string }
  | { error: string; status: number }
  | null;

function isSuccess(
  result: Response
): result is { status: number; userID: string; restaurantId: string; data: any; apiKey: string } {
  return result !== null && "status" in result && "userID" in result;
}

function isError(result: Response): result is { error: string; status: number } {
  return result !== null && "error" in result;
}

export async function POST(req: NextRequest) {
  try {
    const encrypted_data: EncryptedData = await req.json();

    if (!encrypted_data) {
      return NextResponse.json({ message: "Keine Daten empfangen" }, { status: 400 });
    }

    // ------------------------------------------
    // 🔓 ENTZIEFERN
    // ------------------------------------------
    const decryptResult = await decryption(encrypted_data);
    if (isError(decryptResult)) {
      return NextResponse.json({ message: decryptResult.error }, { status: decryptResult.status });
    }

    if (!isSuccess(decryptResult)) {
      return NextResponse.json({ message: "Unbekannter Fehler" }, { status: 500 });
    }

    const { userID, restaurantId, data: decryptedDataString, apiKey } = decryptResult;

    const expectedApiKey = process.env.NEXT_PUBLIC_API_KEY;
    console.log(decryptedDataString)
    if (!expectedApiKey || apiKey !== expectedApiKey) {
      return NextResponse.json({ message: "Ungültiger API-Schlüssel" }, { status: 401 });
    }

    // ------------------------------------------
    // ⬇️ JSON parsen
    // ------------------------------------------
    let parsedData: any[];
    try {
      parsedData = JSON.parse(decryptedDataString);
    } catch {
      return NextResponse.json({ message: "Ungültiges Datenformat" }, { status: 400 });
    }

    if (!Array.isArray(parsedData)) {
      return NextResponse.json({ message: "Daten müssen ein Array sein" }, { status: 400 });
    }

    // ------------------------------------------
    // 🔍 USER & RESTAURANT Prüfen
    // ------------------------------------------
    const user = await prisma.user.findUnique({ where: { id: userID } });

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { menu: { include: { categories: true } } },
    });

    if (!user || !restaurant) {
      return NextResponse.json({ message: "Ungültiger Benutzer oder Restaurant" }, { status: 404 });
    }

    if (restaurant.ownerId !== userID) {
      return NextResponse.json({ message: "Benutzer ist nicht der Besitzer des Restaurants" }, { status: 403 });
    }

    // ------------------------------------------
    // 📌 Menü erzeugen (falls nicht vorhanden)
    // ------------------------------------------
    let menuId: string;

    if (!restaurant.menu) {
      const newMenu = await prisma.menu.create({
        data: {
          name: `Menü für ${restaurant.name}`,
          description: null,
          restaurantID: restaurantId,
          bgColor: "#ffffff",
          font: "Arial",
        },
      });
      menuId = newMenu.id;
    } else {
      menuId = restaurant.menu.id;
    }

    // ==========================================
    // 📦 HAUPTTEIL — ALLE DATEN VERARBEITEN
    // ==========================================

    for (const entry of parsedData) {
      if (entry.type === "menuSection") {
        const section = entry.section;
        const title = section.title;
        const items = section.items || [];

        // 1️⃣ Kategorie suchen oder erstellen
        let category = await prisma.category.findFirst({
          where: { menuId, name: title },
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: title,
              description: null,
              position: null,
              menuId,
            },
          });
        }

        // 2️⃣ Items speichern
        for (const item of items) {
          await prisma.dish.create({
            data: {
              name: item.name,
              description: item.description || null,
              price: parseFloat(item.price),
              imageUrl: item.image || "",
              categoryId: category.id,
              menuId: menuId, // <- notwendig in deinem Schema!
            },
          });
        }
      }
    }

    return NextResponse.json(
      {
        message: "Daten erfolgreich verarbeitet",
        restaurantId,
        menuId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Serverfehler:", err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}

// -------------------------------------------------------
// 🔐 ENTZIEFERUNG
// -------------------------------------------------------
async function decryption(data: EncryptedData): Promise<Response> {
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
    return { error: "Decryption failed", status: 400 };
  }
}
