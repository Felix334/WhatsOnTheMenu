import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { setup_logger } from "@/logger";
import path from "path";
import { unlink, access } from "fs/promises";

const logger = setup_logger();

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (token.role !== "Owner") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const body = await req.json();
    logger.info(`Request received: ${req.method} ${req.url}`);

    const { restaurantId, dishes, categories, files } = body;

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId fehlt" }, { status: 400 });
    }

    const userID = token.id;

    // Ownership check
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant || restaurant.ownerId !== userID) {
      return NextResponse.json({ error: "Unauthorized or restaurant not found" }, { status: 403 });
    }

    // -----------------------------
    // DELETE DB ITEMS  (scoped to the verified restaurant)
    // -----------------------------
    if (dishes && Array.isArray(dishes)) {
      await prisma.dish.deleteMany({
        where: {
          id: { in: dishes },
          category: {
            categoryGroup: {
              Menu: { restaurantId },
            },
          },
        },
      });
    }

    if (categories && Array.isArray(categories)) {
      await prisma.$transaction(async (tx) => {
        await tx.dish.deleteMany({
          where: {
            category: {
              id: { in: categories },
              categoryGroup: {
                Menu: { restaurantId },
              },
            },
          },
        });
        await tx.category.deleteMany({
          where: {
            id: { in: categories },
            categoryGroup: {
              Menu: { restaurantId },
            },
          },
        });
      });
    }

    // -----------------------------
    // DELETE FILES FROM DISK
    // -----------------------------
    if (files && Array.isArray(files)) {
      for (const fileName of files) {
        if (fileName.includes("..") || fileName.includes("/")) continue;

        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          "Restaurant",
          restaurantId,
          fileName
        );

        try {
          await access(filePath);
          await unlink(filePath);
        } catch (err) {
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
