import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStaffAccess, can } from "@/lib/staffAuth";

export async function PATCH(req, { params }) {
  try {
    const { orderID } = await params;
    const { status } = await req.json();

    if (!["confirmed", "done"].includes(status)) {
      return NextResponse.json({ message: "Ungültiger Status" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderID },
      select: { restaurantId: true },
    });

    if (!order) return NextResponse.json({ message: "Nicht gefunden" }, { status: 404 });

    const access = await getStaffAccess(req, order.restaurantId);
    if (!access || !can(access, "orders")) {
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
