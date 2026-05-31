import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

async function authorize(req) {
  const [session, token] = await Promise.all([
    getServerSession(authOptions),
    getToken({ req, secret: process.env.NEXTAUTH_SECRET }),
  ]);
  if (!session || !token || token.role !== "Owner") return null;
  return token;
}

export async function POST(req) {
  try {
    const token = await authorize(req);
    if (!token) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const body = await req.json();
    const { restaurantID, font, bgColor } = body ?? {};

    if (!restaurantID || (!font && !bgColor)) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      select: { ownerId: true },
    });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    if (restaurant.ownerId !== token.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedMenu = await prisma.$transaction(async (tx) => {
      const menu = await tx.menu.findFirst({
        where: { restaurantId: restaurantID },
        select: { id: true, bgColor: true, font: true },
        orderBy: { createdAt: "desc" },
      });

      if (!menu) {
        // if no menu exists, create one with defaults
        return tx.menu.create({
          data: {
            name: "Default Menü",
            description: "Default Menü",
            restaurantId: restaurantID,
            bgColor: bgColor ?? "#FFFFFF",
            font: font ?? "Arial",
            categoryGroup: {
            },
          },
        });
      }

      const dataToUpdate = {
        ...(font ? { font } : null),
        ...(bgColor ? { bgColor } : null),
      };

      const cleaned = Object.fromEntries(
        Object.entries(dataToUpdate).filter(([, v]) => v !== null)
      );

      return tx.menu.update({
        where: { id: menu.id },
        data: cleaned,
      });
    });

    return NextResponse.json({
      message: "Menu updated successfully",
      data: {
        bgColor: updatedMenu.bgColor,
        font: updatedMenu.font,
        menu: updatedMenu,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

