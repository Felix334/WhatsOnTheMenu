import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStaffAccess, can } from "@/lib/staffAuth";

export async function GET(req, { params }) {
  try {
    const { restaurantID } = await params;
    const access = await getStaffAccess(req, restaurantID);

    if (!access || !can(access, "orders")) {
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
