import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getOwnerRestaurant(session) {
  if (!session || session.user?.role !== "Owner") return null;
  return prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
    select: { id: true },
  });
}

// GET — alle Staff-Einträge des Restaurants abrufen
export async function GET(req) {
  const session = await getServerSession(authOptions);
  const restaurant = await getOwnerRestaurant(session);
  if (!restaurant) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const staff = await prisma.restaurantStaff.findMany({
    where: { restaurantId: restaurant.id },
    include: { user: { select: { name: true, email: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ staff });
}

// POST — neues Staff-Mitglied hinzufügen
export async function POST(req) {
  const session = await getServerSession(authOptions);
  const restaurant = await getOwnerRestaurant(session);
  if (!restaurant) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { email, role } = await req.json();

  if (!email || !["manager", "waiter", "kitchen"].includes(role)) {
    return NextResponse.json({ message: "Ungültige Daten" }, { status: 400 });
  }

  // Prüfen ob der Owner sich selbst einladen will
  if (email === session.user.email) {
    return NextResponse.json({ message: "Du kannst dich nicht selbst einladen" }, { status: 400 });
  }

  // User bereits vorhanden? → direkt verknüpfen
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  const entry = await prisma.restaurantStaff.upsert({
    where: { email_restaurantId: { email, restaurantId: restaurant.id } },
    create: {
      email,
      role,
      restaurantId: restaurant.id,
      userId: existingUser?.id ?? null,
      approved: false,
    },
    update: { role },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ staff: entry }, { status: 201 });
}
