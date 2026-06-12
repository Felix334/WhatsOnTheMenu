import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { restaurantRegistrationSchema } from "@/lib/schemas/restaurant";

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Keine Daten empfangen" }, { status: 400 });
  }

  // Serverseitige Validierung – Client-Validierung allein ist umgehbar.
  const parsed = restaurantRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Ungültige Eingaben", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  try {
    // Ein Owner hat genau ein Restaurant (ownerId ist @unique).
    const existing = await prisma.restaurant.findUnique({
      where: { ownerId: token.id },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Du hast bereits ein Restaurant registriert" },
        { status: 409 }
      );
    }

    const restaurant = await prisma.$transaction(async (tx) => {
      const created = await tx.restaurant.create({
        data: {
          name: data.restaurantName,
          description: data.description || null,
          parentCompany: "Single",
          ownerName: data.ownerName,
          category: data.category || "NONE",
          contactEmail: data.email,
          contactPhone: data.phone,
          website: data.website || null,
          owner: { connect: { id: token.id } },
          menu: {
            create: {
              name: "Standard Menü",
              description: "Default Menü",
              bgColor: "#ffffff",
              font: "Inter",
            },
          },
          locations: {
            create: {
              street: data.street,
              houseNumber: data.houseNumber,
              city: data.city,
              postalCode: data.postalCode,
              country: "DE",
            },
          },
        },
        select: { id: true },
      });

      // FreeTier setzt voraus, dass ein Restaurant existiert (jetzt erstellt).
      await tx.user.update({
        where: { id: token.id },
        data: { role: "Owner", subscription: "FreeTier" },
      });

      return created;
    });

    return NextResponse.json(
      { message: "Restaurant erfolgreich registriert", restaurantId: restaurant.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("FreeTier register error:", err);
    return NextResponse.json({ message: "Interner Serverfehler" }, { status: 500 });
  }
}
