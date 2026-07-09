import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const body = await req.json();
    const { restaurantID, font, bgColor, headingFont, density } = body ?? {};

    if (!restaurantID || (!font && !bgColor && headingFont === undefined && density === undefined)) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    if (density !== undefined && density !== "" && !["compact", "normal", "airy"].includes(density)) {
      return NextResponse.json({ message: "Ungültige Dichte" }, { status: 400 });
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
        return tx.menu.create({
          data: {
            name: "Default Menü",
            description: "Default Menü",
            restaurantId: restaurantID,
            bgColor: bgColor ?? "#FFFFFF",
            font: font ?? "Arial",
            categoryGroup: {},
          },
        });
      }

      const dataToUpdate = {
        ...(font ? { font } : null),
        ...(bgColor ? { bgColor } : null),
        // Leerer String = "Standard" → Feld auf null zurücksetzen
        ...(headingFont !== undefined ? { headingFont: headingFont || null } : null),
        ...(density !== undefined ? { density: density || null } : null),
      };

      // headingFont/density dürfen null sein (= Standard) — nur undefined rausfiltern
      const cleaned = Object.fromEntries(
        Object.entries(dataToUpdate).filter(([, v]) => v !== undefined)
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
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
