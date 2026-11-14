import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { MENU_THEMES, THEME_FIELDS, pickThemeFields } from "@/lib/menuThemes";

// Wendet ein Theme-Preset auf das ganze Menü an (Menü + alle Gruppen + alle Kategorien).
// Premium-Feature: Abo wird serverseitig aus der DB geprüft, nicht aus dem Token.
export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const { restaurantID, theme } = body ?? {};

    if (!restaurantID || !theme || !MENU_THEMES[theme]) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id },
      select: { subscription: true },
    });

    if (!user || !["Professional", "Business"].includes(user.subscription)) {
      return NextResponse.json({ message: "Theme-Presets sind ein Premium-Feature" }, { status: 403 });
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

    const menu = await prisma.menu.findFirst({
      where: { restaurantId: restaurantID },
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });

    if (!menu) {
      return NextResponse.json({ message: "Kein Menü gefunden" }, { status: 404 });
    }

    const preset = MENU_THEMES[theme];

    // Booleans in select-Objekte für die Theme-Felder verwandeln
    const selectOf = (level) => Object.fromEntries(THEME_FIELDS[level].map((k) => [k, true]));

    await prisma.$transaction(async (tx) => {
      // Alten Stand sichern, damit sich das Theme zurücknehmen lässt (undoTheme).
      // Nur eine Stufe: ein weiteres Theme überschreibt den Schnappschuss.
      // Nacheinander: eine interaktive Transaktion hat genau eine Verbindung.
      const currentMenu = await tx.menu.findUnique({ where: { id: menu.id }, select: selectOf("menu") });
      const groups = await tx.categoryGroup.findMany({ where: { menuID: menu.id }, select: { id: true, ...selectOf("group") } });
      const categories = await tx.category.findMany({ where: { categoryGroup: { menuID: menu.id } }, select: { id: true, ...selectOf("category") } });

      const themeSnapshot = {
        menu: pickThemeFields(currentMenu, "menu"),
        groups: groups.map((g) => ({ id: g.id, ...pickThemeFields(g, "group") })),
        categories: categories.map((c) => ({ id: c.id, ...pickThemeFields(c, "category") })),
      };

      await tx.menu.update({ where: { id: menu.id }, data: { ...preset.menu, themeSnapshot } });
      await tx.categoryGroup.updateMany({ where: { menuID: menu.id }, data: preset.group });
      await tx.category.updateMany({ where: { categoryGroup: { menuID: menu.id } }, data: preset.category });
    });

    return NextResponse.json({ message: "Theme angewendet", theme });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
