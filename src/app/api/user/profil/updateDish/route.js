import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { dishDetailsSchema, effectiveDishPrice } from "@/lib/schemas/dish";

export const dynamic = "force-dynamic";

/**
 * Speichert ein bestehendes Gericht komplett: Name, Beschreibung, Preis,
 * Allergene, Zusatzstoffe, Merkmale, Schärfe und Größen/Preisvarianten.
 *
 * Eine Route statt mehrerer, damit der Bearbeiten-Dialog mit einem einzigen
 * Speichern auskommt und nie nur die Hälfte einer Änderung in der DB landet.
 * Varianten werden komplett ersetzt (deleteMany + createMany in derselben
 * Transaktion) — bei höchstens 8 Einträgen einfacher und sicherer als ein Diff.
 */
export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Owner") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const dishId = body?.dishId;
    if (typeof dishId !== "string" || !dishId) {
      return NextResponse.json({ error: "dishId fehlt" }, { status: 400 });
    }

    const parsed = dishDetailsSchema.safeParse(body?.dish);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ungültige Daten" }, { status: 400 });
    }
    const data = parsed.data;

    // Besitz über die komplette Relationskette prüfen — eine fremde dishId trifft nichts.
    const dish = await prisma.dish.findFirst({
      where: {
        id: dishId,
        category: { categoryGroup: { Menu: { restaurant: { ownerId: token.id } } } },
      },
      select: { id: true },
    });
    if (!dish) {
      return NextResponse.json({ error: "Gericht nicht gefunden oder keine Berechtigung" }, { status: 404 });
    }

    const price = effectiveDishPrice(data.price, data.variants);

    const [, , updated] = await prisma.$transaction([
      prisma.dishVariant.deleteMany({ where: { dishId } }),
      prisma.dishVariant.createMany({
        data: data.variants.map((v, index) => ({
          dishId,
          label: v.label,
          price: v.price.toFixed(2),
          position: index,
        })),
      }),
      prisma.dish.update({
        where: { id: dishId },
        data: {
          name: data.name,
          description: data.description,
          price: price.toFixed(2),
          allergens: data.allergens,
          additives: data.additives,
          tags: data.tags,
          spiceLevel: data.spiceLevel,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          allergens: true,
          additives: true,
          tags: true,
          spiceLevel: true,
          variants: { orderBy: { position: "asc" }, select: { id: true, label: true, price: true, position: true } },
        },
      }),
    ]);

    return NextResponse.json({ dish: updated });
  } catch (error) {
    console.error("updateDish error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
