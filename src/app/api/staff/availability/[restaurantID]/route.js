import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStaffAccess, can } from "@/lib/staffAuth";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const { restaurantID } = await params;

  const access = await getStaffAccess(req, restaurantID);
  if (!access) {
    return NextResponse.json(
      { error: "Kein Zugriff. Stelle sicher, dass das Restaurant ein Professional-Abonnement hat." },
      { status: 403 }
    );
  }
  if (!can(access, "availability")) {
    return NextResponse.json(
      { error: "Deine Rolle hat keine Berechtigung für die Verfügbarkeitsverwaltung." },
      { status: 403 }
    );
  }

  const menu = await prisma.menu.findFirst({
    where: { restaurantId: restaurantID },
    select: {
      categoryGroup: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          name: true,
          categories: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              name: true,
              dishes: {
                orderBy: { createdAt: "asc" },
                select: {
                  id: true,
                  name: true,
                  price: true,
                  stock: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!menu) {
    return NextResponse.json({ error: "Kein Menü gefunden." }, { status: 404 });
  }
  return NextResponse.json({ menu });
}
