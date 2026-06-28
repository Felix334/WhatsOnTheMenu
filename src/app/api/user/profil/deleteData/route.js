import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { setup_logger } from "@/logger";

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

    const { restaurantId, dishes, categories } = body;

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId fehlt" }, { status: 400 });
    }

    const userID = token.id;

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant || restaurant.ownerId !== userID) {
      return NextResponse.json({ error: "Unauthorized or restaurant not found" }, { status: 403 });
    }

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

    return NextResponse.json({ message: "Data deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
