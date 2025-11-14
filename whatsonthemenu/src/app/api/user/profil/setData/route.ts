import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as CryptoJS from "crypto-js";

const prisma = new PrismaClient();

interface EncryptedData {
  encrypted_user_id: string;
  encrypted_restaurant_id: string;
  encrypted_data: string;  // Encrypted JSON string of the data array
  encrypted_api_key: string;
}

type Response =
  | { status: number; userID: string; restaurantId: string; data: any; apiKey: string }
  | { error: string; status: number }
  | null;

function isSuccess(result: Response): result is { status: number; userID: string; restaurantId: string; data: any; apiKey: string } {
  return result !== null && "status" in result && "userID" in result;
}

function isError(result: Response): result is { error: string; status: number } {
  return result !== null && "error" in result && "status" in result;
}


export async function POST(req: NextRequest) {
  try {
    const encrypted_data: EncryptedData = await req.json();
    console.log("Daten empfangen:", encrypted_data);
    if (!encrypted_data) {
      return NextResponse.json({ message: "Keine Daten empfangen" }, { status: 400 });
    }

    // Decrypt the data
    const decryptResult = await decryption(encrypted_data);
    if (isError(decryptResult)) {
      return NextResponse.json({ message: decryptResult.error }, { status: decryptResult.status });
    }

    if (isSuccess(decryptResult)) {
      console.log("Successful decryption");
      const { userID, restaurantId, data: decryptedDataString, apiKey } = decryptResult;

      // Validate API key
      const expectedApiKey = process.env.NEXT_PUBLIC_API_KEY;
      console.log("Expected API Key:", expectedApiKey, "Decrypted API Key:", apiKey);
      if (!expectedApiKey || apiKey !== expectedApiKey) {
        return NextResponse.json({ message: "Ungültiger API-Schlüssel" }, { status: 401 });
      }

      // Parse the decrypted data
      let parsedData;
      try {
        parsedData = JSON.parse(decryptedDataString);
      } catch (parseError) {
        console.error("Fehler beim Parsen der Daten:", parseError);
        return NextResponse.json({ message: "Ungültiges Datenformat" }, { status: 400 });
      }

      if (!Array.isArray(parsedData)) {
        return NextResponse.json({ message: "Daten müssen ein Array sein" }, { status: 400 });
      }


      const user = await prisma.user.findUnique({ where: { id: userID } });
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: { menu: true },  // Include menu to check if it exists
      });
      console.log("User found:", !!user, "Restaurant found:", !!restaurant, "Menu found:", !!restaurant?.menu);
      if (!user || !restaurant) {
        return NextResponse.json({ message: "Ungültiger Benutzer oder Restaurant" }, { status: 404 });
      }
      if (restaurant.ownerId !== userID) {
        return NextResponse.json({ message: "Benutzer ist nicht der Besitzer des Restaurants" }, { status: 403 });
      }

      let menuId;
      if (!restaurant.menu) {
        // Create a new menu for the restaurant
        console.log("Kein Menü gefunden, erstelle neues Menü...");
        try {
          const newMenu = await prisma.menu.create({
            data: {
              name: `Menü für ${restaurant.name}`,  // Default name based on restaurant
              description: null,
              restaurantID: restaurantId,
              bgColor: "#ffffff",  // Default background color
              font: "Arial",  // Default font
            },
          });
          menuId = newMenu.id;
          console.log("Neues Menü erstellt mit ID:", menuId);
        } catch (menuError) {
          console.error("Fehler beim Erstellen des Menüs:", menuError);
          return NextResponse.json({ message: "Fehler beim Erstellen des Menüs" }, { status: 500 });
        }
      } else {
        menuId = restaurant.menu.id;
      }

      console.log(`Empfangene Daten: userID: ${userID}, RestaurantID: ${restaurantId}, MenuID: ${menuId}, Daten:`, parsedData);

      for (const menuSection of parsedData) {
        if (!menuSection.section || !menuSection.section.title) {
          console.warn("MenuSection ohne 'section.title' übersprungen:", menuSection);
          continue;
        }

        const categoryName = menuSection.section.title;
        const items = menuSection.section.items || [];
        console.log(`Verarbeite Kategorie: ${categoryName} mit ${items.length} Gerichten`);

        try {
          const category = await prisma.category.create({
            data: {
              name: categoryName,
              menuId,
            },
          });

          // Process dishes
          for (const dishData of items) {
            if (!dishData.name || !dishData.price) {
              console.warn("Gericht ohne 'name' oder 'price' übersprungen:", dishData);
              continue;
            }

            console.log(`Verarbeite Gericht: ${dishData.name}`);

            // Create dish (assuming no ID for updates; use create)
            await prisma.dish.create({
              data: {
                name: dishData.name,
                description: dishData.description || null,
                price: parseFloat(dishData.price),  // Convert string to float
                imageUrl: dishData.image || "",  // Use empty string if missing
                categoryId: category.id,
                menuId,
              },
            });

            // Note: No ingredients in your data, so skipping that part
          }
        } catch (dbError) {
          console.error("Fehler beim Speichern der Kategorie/Gericht:", dbError);
          return NextResponse.json({ message: "Fehler beim Speichern der Daten" }, { status: 500 });
        }
      }

      return NextResponse.json({ status: 201, message: "Daten erfolgreich gespeichert" });
    }

    // Fallback
    return NextResponse.json({ message: "Unbekannter Fehler" }, { status: 500 });
  } catch (error) {
    console.log("Ein Fehler in der API ist aufgetreten: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

async function decryption(data: EncryptedData): Promise<Response> {
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  console.log("Encryption Key Kontrolle (API):", encryptionKey);
  if (!encryptionKey) {
    console.error("Encryption-Key konnte nicht gelesen werden");
    return { error: "Encryption key not found", status: 500 };
  }

  try {
    const decryptedUserId = CryptoJS.AES.decrypt(data.encrypted_user_id, encryptionKey).toString(CryptoJS.enc.Utf8);
    const decryptedRestaurantId = CryptoJS.AES.decrypt(data.encrypted_restaurant_id, encryptionKey).toString(CryptoJS.enc.Utf8);
    const decryptedData = CryptoJS.AES.decrypt(data.encrypted_data, encryptionKey).toString(CryptoJS.enc.Utf8);
    const decryptedApiKey = CryptoJS.AES.decrypt(data.encrypted_api_key, encryptionKey).toString(CryptoJS.enc.Utf8);

    if (!decryptedUserId || !decryptedRestaurantId || !decryptedData || !decryptedApiKey) {
      return { error: "Entschlüsselung fehlgeschlagen - leere Werte", status: 400 };
    }
    console.log(`Decrypted UserID: ${decryptedUserId}, decrypted restaurantID: ${decryptedRestaurantId}, decrypted data: ${decryptedData}, decrypted api-key: ${decryptedApiKey}`);

    return {
      userID: decryptedUserId,
      restaurantId: decryptedRestaurantId,
      data: decryptedData,
      apiKey: decryptedApiKey,
      status: 200,
    };
  } catch (error) {
    console.error("Decryption failed:", error);
    return { error: "Decryption failed", status: 400 };
  }
}