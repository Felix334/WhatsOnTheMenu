import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Owner") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: token.id },
    select: { id: true, name: true },
  });

  if (!restaurant) {
    return NextResponse.json({ message: "Kein Restaurant gefunden" }, { status: 404 });
  }

  return NextResponse.json({ restaurant });
}
