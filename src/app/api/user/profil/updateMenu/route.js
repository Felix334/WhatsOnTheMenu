import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { isMenuBgColorAllowed, isMenuFontColorAllowed } from "@/lib/schemas/colorPresets";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const body = await req.json();
    const { restaurantID, font, bgColor, fontColor, headingFont, density } = body ?? {};

    if (!restaurantID || (!font && !bgColor && fontColor === undefined && headingFont === undefined && density === undefined)) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    if (density !== undefined && density !== "" && !["compact", "normal", "airy"].includes(density)) {
      return NextResponse.json({ message: "Ungültige Dichte" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      select: {
        ownerId: true,
        owner: { select: { subscription: true } },
        menu: { select: { bgColor: true, fontColor: true }, orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    if (restaurant.ownerId !== token.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Freie Farbwahl erst ab Plus — Abo frisch aus der DB, nicht aus dem JWT.
    // Unveränderte Werte bleiben erlaubt, sonst könnte ein Nutzer nach einem
    // Downgrade seine Schrift nicht mehr speichern, weil der Editor die alte
    // Hex-Farbe mitschickt.
    const subscription = restaurant.owner.subscription;
    const current = restaurant.menu[0] ?? {};
    const bgChanged = bgColor && bgColor !== current.bgColor;
    const fontColorChanged = fontColor !== undefined && (fontColor || null) !== (current.fontColor ?? null);
    if ((bgChanged && !isMenuBgColorAllowed(bgColor, subscription)) || (fontColorChanged && !isMenuFontColorAllowed(fontColor, subscription))) {
      return NextResponse.json({ message: "Eigene Farben gibt es ab dem Plus-Tarif" }, { status: 403 });
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
        ...(fontColor !== undefined ? { fontColor: fontColor || null } : null),
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
