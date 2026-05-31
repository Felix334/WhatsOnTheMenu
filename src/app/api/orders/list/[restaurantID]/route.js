import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "Owner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { restaurantID } = await params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      select: { ownerId: true },
    });

    if (!restaurant || restaurant.ownerId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurantID,
        status: { in: ["pending", "confirmed"] },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}
