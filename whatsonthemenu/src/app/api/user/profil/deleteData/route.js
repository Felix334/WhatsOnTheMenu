import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as CryptoJS from "crypto-js";
import { setup_logger } from "@/logger";

const prisma = new PrismaClient();
const logger = setup_logger();

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const encryptedData = await req.json();
    console.log("Empfangene verschlüsselte Daten:", encryptedData);
    logger.info(`Request received: ${req.method} ${req.url}`);

    // Check if encrypted_data is present
    if (!encryptedData.encrypted_data) {
      return NextResponse.json({ error: "Missing encrypted_data field" }, { status: 400 });
    }

    // Decrypt the data
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    if (!key) {
      return NextResponse.json({ error: "Encryption key missing" }, { status: 500 });
    }

    const decryptedUserId = CryptoJS.AES.decrypt(encryptedData.encrypted_user_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedRestaurantId = CryptoJS.AES.decrypt(encryptedData.encrypted_restaurant_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedData = CryptoJS.AES.decrypt(encryptedData.encrypted_data, key).toString(CryptoJS.enc.Utf8);
    const decryptedApiKey = CryptoJS.AES.decrypt(encryptedData.encrypted_api_key, key).toString(CryptoJS.enc.Utf8);

    if (!decryptedUserId || !decryptedRestaurantId || !decryptedData || !decryptedApiKey) {
      return NextResponse.json({ error: "Decryption failed" }, { status: 400 });
    }

    // Validate API key
    const expectedApiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (decryptedApiKey !== expectedApiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Parse the data
    const data = JSON.parse(decryptedData);
    console.log("Entschlüsselte Daten:(Delete-API)", data);

    // Validate user and restaurant
    const user = await prisma.user.findUnique({ where: { id: decryptedUserId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: decryptedRestaurantId } });
    if (!restaurant || restaurant.ownerId !== decryptedUserId) {
      return NextResponse.json({ error: "Unauthorized or restaurant not found" }, { status: 403 });
    }

    if (data.dishes && Array.isArray(data.dishes)) {
      await prisma.dish.deleteMany({ where: { id: { in: data.dishes } } });
    }

    if (data.categories && Array.isArray(data.categories)) {
      await prisma.$transaction(async (tx) => {
        await tx.dish.deleteMany({ where: { categoryId: { in: data.categories } } });
        await tx.category.deleteMany({ where: { id: { in: data.categories } } });
      });
    }

    return NextResponse.json({ message: "Data deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
