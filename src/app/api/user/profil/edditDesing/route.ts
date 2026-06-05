import { prisma } from "src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import CryptoJS from "crypto-js";
import { User, Restaurant } from "@prisma/client";

interface EncryptedData {
  encrypted_user_id: string;
  encrypted_restaurant_id: string;
  encrypted_data: string;
}

type SuccessResponse = {
  status: number;
  userID: string;
  restaurantId: string;
  data: string;
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
    console.error(`DATABASE ERROR in ${context}:`, err);
    throw new Error(`Database error in ${context}`);
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
      return NextResponse.json({ error: "Keine Daten empfangen" }, { status: 400 });
    }

    const decryptResult = await decryption(encrypted_data);
    if (isError(decryptResult)) {
      return NextResponse.json({ message: decryptResult.error }, { status: decryptResult.status });
    }
    if (!isSuccess(decryptResult)) {
      return NextResponse.json({ message: "Unbekannter Entschlüsselungsfehler" }, { status: 500 });
    }

    const { userID, restaurantId, data: decryptedDataString } = decryptResult;

    // Verify the decrypted userID matches the session
    if (userID !== session.user.id) {
      return NextResponse.json({ message: "Nicht autorisiert" }, { status: 403 });
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(decryptedDataString);
    } catch {
      return NextResponse.json({ message: "Ungültiges JSON im entschlüsselten Feld" }, { status: 400 });
    }

    if (!Array.isArray(parsedData)) {
      return NextResponse.json({ message: "Daten müssen ein Array sein" }, { status: 400 });
    }

    const user = await safeDb(() => prisma.user.findUnique({ where: { id: userID } }), "user.findUnique") as User | null;
    const restaurant = await safeDb(() => prisma.restaurant.findUnique({ where: { id: restaurantId } }), "restaurant.findUnique") as Restaurant | null;

    if (!user || !restaurant || user.role !== "Owner") {
      return NextResponse.json({ message: "Ungültiger Nutzer oder Restaurant" }, { status: 401 });
    }

    if (restaurant.ownerId !== userID) {
      return NextResponse.json({ message: "Kein berechtigter Benutzer" }, { status: 403 });
    }

    return NextResponse.json({ status: 200, message: "OK" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Interner Serverfehler" }, { status: 500 });
  }
}

async function decryption(data: EncryptedData): Promise<DecryptResult> {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!key) return { error: "Encryption key missing", status: 500 };

  try {
    const decryptedUserId = CryptoJS.AES.decrypt(data.encrypted_user_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedRestaurantId = CryptoJS.AES.decrypt(data.encrypted_restaurant_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedData = CryptoJS.AES.decrypt(data.encrypted_data, key).toString(CryptoJS.enc.Utf8);

    if (!decryptedUserId || !decryptedRestaurantId || !decryptedData) {
      return { error: "Entschlüsselung fehlgeschlagen (leere Werte)", status: 400 };
    }

    return {
      userID: decryptedUserId,
      restaurantId: decryptedRestaurantId,
      data: decryptedData,
      status: 200,
    };
  } catch (e) {
    console.error("Decryption error:", e);
    return { error: "Decryption failed", status: 400 };
  }
}
