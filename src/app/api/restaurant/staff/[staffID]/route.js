import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function verifyOwnership(session, staffID) {
  if (!session || session.user?.role !== "Owner") return null;
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
    select: { id: true },
  });
  if (!restaurant) return null;
  const entry = await prisma.restaurantStaff.findUnique({
    where: { id: staffID },
  });
  if (!entry || entry.restaurantId !== restaurant.id) return null;
  return entry;
}

// PATCH — genehmigen oder Rolle ändern
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  const { staffID } = await params;
  const entry = await verifyOwnership(session, staffID);
  if (!entry) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { approved, role } = await req.json();

  const updated = await prisma.restaurantStaff.update({
    where: { id: staffID },
    data: {
      ...(approved !== undefined && { approved }),
      ...(role && ["manager", "waiter", "kitchen"].includes(role) && { role }),
    },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ staff: updated });
}

// DELETE — Mitarbeiter entfernen
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  const { staffID } = await params;
  const entry = await verifyOwnership(session, staffID);
  if (!entry) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.restaurantStaff.delete({ where: { id: staffID } });

  return NextResponse.json({ message: "Entfernt" });
}
