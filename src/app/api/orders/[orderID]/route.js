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

    const { orderID } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderID },
      include: { restaurant: { select: { ownerId: true } } },
    });

    if (!order || order.restaurant.ownerId !== session.user.id) {
      return NextResponse.json({ message: "Nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}
