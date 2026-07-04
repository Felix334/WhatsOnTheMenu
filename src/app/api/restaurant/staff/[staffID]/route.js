import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

async function verifyOwnership(token, staffID) {
  if (!token || token.role !== "Owner") return null;
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: token.id },
    select: { id: true },
  });
  if (!restaurant) return null;
  const entry = await prisma.restaurantStaff.findUnique({
    where: { id: staffID },
  });
  if (!entry || entry.restaurantId !== restaurant.id) return null;
  return entry;
}

export async function PATCH(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { staffID } = await params;
  const entry = await verifyOwnership(token, staffID);
  if (!entry) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Der Owner darf NUR die Rolle einer Einladung ändern. `approved` (= Zustimmung
  // zur Rollenzuweisung) setzt ausschließlich der eingeladene User selbst über
  // /api/restaurant/staff/invitations/[staffID]. Sonst könnte ein Owner fremden
  // Accounts einseitig die globale Rolle überschreiben.
  const { role } = await req.json();

  const updated = await prisma.restaurantStaff.update({
    where: { id: staffID },
    data: {
      ...(role && ["manager", "waiter", "kitchen"].includes(role) && { role }),
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ staff: updated });
}

export async function DELETE(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { staffID } = await params;
  const entry = await verifyOwnership(token, staffID);
  if (!entry) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.restaurantStaff.delete({ where: { id: staffID } });

  if (entry.userId) {
    const remaining = await prisma.restaurantStaff.count({
      where: { userId: entry.userId, approved: true },
    });
    if (remaining === 0) {
      // Nur zurückstufen, wenn der Nutzer wirklich (nur) Staff ist.
      // Owner/Admin niemals anfassen – deren globale Rolle hängt nicht an einer
      // Restaurant-Mitgliedschaft.
      const target = await prisma.user.findUnique({
        where: { id: entry.userId },
        select: { role: true },
      });
      if (target?.role === "Staff") {
        await prisma.user.update({
          where: { id: entry.userId },
          data: { role: "User" },
        });
      }
    }
  }

  return NextResponse.json({ message: "Entfernt" });
}
