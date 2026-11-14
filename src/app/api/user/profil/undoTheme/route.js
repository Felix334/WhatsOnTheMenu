import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { pickThemeFields } from "@/lib/menuThemes";

export const dynamic = "force-dynamic";

/**
 * Nimmt das zuletzt angewendete Theme zurück: stellt die Gestaltung aus
 * Menu.themeSnapshot (geschrieben von applyTheme) wieder her und löscht den
 * Schnappschuss.
 *
 * Keine Abo-Prüfung: ein Schnappschuss entsteht nur beim Anwenden eines Themes
 * (Plus/Premium) und enthält ausschließlich den eigenen Stand von davor.
 * Geschrieben werden nur Theme-Felder (Whitelist) und nur Gruppen/Kategorien,
 * die zu diesem Menü gehören.
 */
export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const restaurantID = body?.restaurantID;
    if (typeof restaurantID !== "string" || !restaurantID) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    const menu = await prisma.menu.findFirst({
      where: { restaurantId: restaurantID, restaurant: { ownerId: token.id } },
      select: { id: true, themeSnapshot: true },
      orderBy: { createdAt: "desc" },
    });

    if (!menu) {
      return NextResponse.json({ message: "Kein Menü gefunden" }, { status: 404 });
    }

    const snapshot = menu.themeSnapshot;
    if (!snapshot || typeof snapshot !== "object") {
      return NextResponse.json({ message: "Es gibt kein Theme zum Rückgängigmachen" }, { status: 409 });
    }

    const groups = Array.isArray(snapshot.groups) ? snapshot.groups : [];
    const categories = Array.isArray(snapshot.categories) ? snapshot.categories : [];

    const ops = [
      prisma.menu.update({
        where: { id: menu.id },
        data: { ...pickThemeFields(snapshot.menu, "menu"), themeSnapshot: Prisma.DbNull },
      }),
    ];

    for (const g of groups) {
      const data = pickThemeFields(g, "group");
      if (typeof g?.id !== "string" || Object.keys(data).length === 0) continue;
      // color ist in der DB Pflicht — ein null aus dem Schnappschuss nicht schreiben
      if (data.color == null) delete data.color;
      ops.push(prisma.categoryGroup.updateMany({ where: { id: g.id, menuID: menu.id }, data }));
    }

    for (const c of categories) {
      const data = pickThemeFields(c, "category");
      if (typeof c?.id !== "string" || Object.keys(data).length === 0) continue;
      ops.push(prisma.category.updateMany({ where: { id: c.id, categoryGroup: { menuID: menu.id } }, data }));
    }

    await prisma.$transaction(ops);

    return NextResponse.json({ message: "Theme zurückgenommen" });
  } catch (err) {
    console.error("undoTheme error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
