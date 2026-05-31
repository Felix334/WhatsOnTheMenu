import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "Owner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderID } = await params;
    const { status } = await req.json();

    if (!["confirmed", "done"].includes(status)) {
      return NextResponse.json({ message: "Ungültiger Status" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderID },
      include: { restaurant: { select: { ownerId: true } } },
    });

    if (!order || order.restaurant.ownerId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updated = await prisma.order.update({
      where: { id: orderID },
      data: { status },
    });

    return NextResponse.json({ order: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Serverfehler" }, { status: 500 });
  }
}
