import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

// Offene Einladungen des eingeloggten Users (per userId ODER E-Mail zugeordnet).
// Die Zustimmung zur Rollenzuweisung trifft ausschließlich der eingeladene User selbst.
export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const invitations = await prisma.restaurantStaff.findMany({
    where: {
      approved: false,
      OR: [
        { userId: token.id },
        ...(token.email ? [{ email: token.email }] : []),
      ],
    },
    select: {
      id: true,
      role: true,
      restaurant: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ invitations });
}
