import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

// Der eingeladene User nimmt eine Einladung an oder lehnt sie ab.
// Nur hier wird `approved` gesetzt – der Owner kann das NICHT selbst tun.
export async function PATCH(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { staffID } = await params;
  const { action } = await req.json().catch(() => ({}));

  if (action !== "accept" && action !== "decline") {
    return NextResponse.json({ message: "Ungültige Aktion" }, { status: 400 });
  }

  const entry = await prisma.restaurantStaff.findUnique({
    where: { id: staffID },
    select: { id: true, userId: true, email: true, approved: true, role: true },
  });

  // Die Einladung muss wirklich diesem User gehören (per userId oder E-Mail).
  const belongsToUser =
    entry &&
    !entry.approved &&
    (entry.userId === token.id || (!!token.email && entry.email === token.email));

  if (!belongsToUser) {
    return NextResponse.json({ message: "Einladung nicht gefunden" }, { status: 404 });
  }

  if (action === "decline") {
    await prisma.restaurantStaff.delete({ where: { id: staffID } });
    return NextResponse.json({ message: "Einladung abgelehnt" });
  }

  // action === "accept"
  await prisma.restaurantStaff.update({
    where: { id: staffID },
    data: { approved: true, userId: token.id },
  });

  // Globale Rolle NUR hochstufen, wenn der User bislang ein einfacher "User" ist.
  // Owner/Admin (und bestehende Staff) werden niemals überschrieben – so kann ein
  // Owner per Einladung keinen fremden Account entmachten.
  const me = await prisma.user.findUnique({
    where: { id: token.id },
    select: { role: true },
  });

  let roleChanged = false;
  if (me?.role === "User") {
    await prisma.user.update({
      where: { id: token.id },
      data: { role: "Staff" },
    });
    roleChanged = true;
  }

  return NextResponse.json({ message: "Einladung angenommen", roleChanged });
}
