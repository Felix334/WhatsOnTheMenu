import { prisma } from "src/lib/prisma";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import CryptoJS from "crypto-js";

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
    const encrypted_data: EncryptedData | null = await req.json().catch(() => null);

    if (!encrypted_data) {
      return NextResponse.json({ status: 400, error: "Keine Daten empfangen" });
    }

    const decryptResult = await decryption(encrypted_data);
    if (isError(decryptResult)) {
      return NextResponse.json({ message: decryptResult.error }, { status: decryptResult.status });
    }
    if (!isSuccess(decryptResult)) {
      return NextResponse.json({ message: "Unbekannter Entschlüsselungsfehler" }, { status: 500 });
    }
    const { userID, restaurantId, data: decryptedDataString, apiKey } = decryptResult;

    // server-only API key
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

    const user = await safeDb(() => prisma.user.findUnique({ where: { id: userID } }), "user.findUnique");
    const restaurant = await safeDb(() => prisma.restaurant.findUnique({ where: { id: restaurantId } }), "restaurant.findUnique");

    if (!user || !restaurant || user.role != "Owner") {
      return NextResponse.json({status: 401, message: "Ungültiger Nutzer oder Restaurant" });
    }

    if (restaurant.ownerId != userID) {
      return NextResponse.json({status: 401, message: "Kein berrechtigter Benutzer" });
    }
  } catch (err) {
    console.log(err);
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
