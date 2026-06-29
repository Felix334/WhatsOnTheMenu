import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function GET(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderID } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderID },
      include: { restaurant: { select: { ownerId: true } } },
    });

    if (!order || order.restaurant.ownerId !== token.id) {
      return NextResponse.json({ message: "Nicht gefunden" }, { status: 404 });
    }

    if (token.subscription !== "Professional") {
      return NextResponse.json({ message: "Professional-Abonnement erforderlich" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}
