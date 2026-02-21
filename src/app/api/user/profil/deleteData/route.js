import { NextResponse } from "next/server";
import {prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as CryptoJS from "crypto-js";
import { setup_logger } from "@/logger";
import path from "path";
import { unlink, access } from "fs/promises";

const logger = setup_logger();

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const encryptedData = await req.json();
    logger.info(`Request received: ${req.method} ${req.url}`);

    if (!encryptedData.encrypted_data) {
      return NextResponse.json({ error: "Missing encrypted_data field" }, { status: 400 });
    }

    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    if (!key) return NextResponse.json({ error: "Encryption key missing" }, { status: 500 });

    const decryptedUserId = CryptoJS.AES.decrypt(encryptedData.encrypted_user_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedRestaurantId = CryptoJS.AES.decrypt(encryptedData.encrypted_restaurant_id, key).toString(CryptoJS.enc.Utf8);
    const decryptedData = CryptoJS.AES.decrypt(encryptedData.encrypted_data, key).toString(CryptoJS.enc.Utf8);
    const decryptedApiKey = CryptoJS.AES.decrypt(encryptedData.encrypted_api_key, key).toString(CryptoJS.enc.Utf8);

    if (!decryptedUserId || !decryptedRestaurantId || !decryptedData || !decryptedApiKey) {
      return NextResponse.json({ error: "Decryption failed" }, { status: 400 });
    }

    const expectedApiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (decryptedApiKey !== expectedApiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const data = JSON.parse(decryptedData);

    const user = await prisma.user.findUnique({ where: { id: decryptedUserId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const restaurant = await prisma.restaurant.findUnique({ where: { id: decryptedRestaurantId } });
    if (!restaurant || restaurant.ownerId !== decryptedUserId) {
      return NextResponse.json({ error: "Unauthorized or restaurant not found" }, { status: 403 });
    }

    // -----------------------------
    // DELETE DB ITEMS
    // -----------------------------
    if (data.dishes && Array.isArray(data.dishes)) {
      await prisma.dish.deleteMany({ where: { id: { in: data.dishes } } });
    }

    if (data.categories && Array.isArray(data.categories)) {
      await prisma.$transaction(async (tx) => {
        await tx.dish.deleteMany({ where: { categoryId: { in: data.categories } } });
        await tx.category.deleteMany({ where: { id: { in: data.categories } } });
      });
    }

    // -----------------------------
    // DELETE FILES FROM DISK
    // -----------------------------
    if (data.files && Array.isArray(data.files)) {
      for (const fileName of data.files) {
        // security: prevent directory traversal
        if (fileName.includes("..") || fileName.includes("/")) continue;

        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          "Restaurant",
          decryptedRestaurantId,
          fileName
        );

        try {
          await access(filePath);
          await unlink(filePath);
        } catch (err) {
          // Ignore "file not found"
          if (err.code !== "ENOENT") {
            console.error("File delete error:", err);
          }
        }
      }
    }

    return NextResponse.json({ message: "Data deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
