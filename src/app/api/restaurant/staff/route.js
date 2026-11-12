import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

async function getOwnerRestaurant(token) {
  if (!token || token.role !== "Owner") return null;
  return prisma.restaurant.findUnique({
    where: { ownerId: token.id },
    select: { id: true, owner: { select: { subscription: true } } },
  });
}

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const restaurant = await getOwnerRestaurant(token);
  if (!restaurant) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const staff = await prisma.restaurantStaff.findMany({
    where: { restaurantId: restaurant.id },
    include: { user: { select: { name: true, email: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ staff });
}

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const restaurant = await getOwnerRestaurant(token);
  if (!restaurant) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Personalverwaltung ist ein Premium-Feature. Ohne diese Prüfung konnte jeder
  // Owner einladen, und die Annahme der Einladung hob den Eingeladenen
  // global auf die Rolle "Staff" — obwohl getStaffAccess ihm danach ohnehin
  // nichts erlaubt. Abo frisch aus der DB, nicht aus dem JWT.
  if (restaurant.owner.subscription !== "Professional") {
    return NextResponse.json({ message: "Personalverwaltung gibt es nur im Premium-Tarif" }, { status: 403 });
  }

  const { email, role } = await req.json();

  if (!email || !["manager", "waiter", "kitchen"].includes(role)) {
    return NextResponse.json({ message: "Ungültige Daten" }, { status: 400 });
  }

  if (email === token.email) {
    return NextResponse.json({ message: "Du kannst dich nicht selbst einladen" }, { status: 400 });
  }

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
