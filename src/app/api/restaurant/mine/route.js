import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "Owner") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
    select: { id: true, name: true },
  });

  if (!restaurant) {
    return NextResponse.json({ message: "Kein Restaurant gefunden" }, { status: 404 });
  }

  return NextResponse.json({ restaurant });
}
