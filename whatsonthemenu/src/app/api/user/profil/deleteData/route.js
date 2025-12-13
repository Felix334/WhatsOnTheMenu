import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as CryptoJS from "crypto-js";

const prisma = new PrismaClient();

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const encryptedData = await req.json();
        console.log("Empfangene verschlüsselte Daten:", encryptedData);

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

        // Process deletions
        if (data.dishes && Array.isArray(data.dishes)) {
            for (const dishId of data.dishes) {
                try {
                    await prisma.dish.delete({ where: { id: dishId } });
                } catch (deleteError) {
                    console.warn(`Failed to delete dish ${dishId}:`, deleteError.message);
                    // Continue with other deletions
                }
            }
        }

        if (data.categories && Array.isArray(data.categories)) {
            for (const categoryId of data.categories) {
                try {
                    // Deleting a category will cascade delete its dishes due to schema relations
                    await prisma.category.delete({ where: { id: categoryId } });
                } catch (deleteError) {
                    console.warn(`Failed to delete category ${categoryId}:`, deleteError.message);
                    // Continue with other deletions
                }
            }
        }

        return NextResponse.json({ message: "Data deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
