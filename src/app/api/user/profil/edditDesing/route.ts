import { prisma } from "src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";

async function safeDb<T>(callback: () => Promise<T>, context: string): Promise<T> {
  try {
    return await callback();
  } catch (err) {
    console.error(`DATABASE ERROR in ${context}:`, err);
    throw new Error(`Database error in ${context}`);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "Owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body?.restaurantId) {
      return NextResponse.json({ error: "restaurantId fehlt" }, { status: 400 });
    }

    const { restaurantId } = body;
    const userID = session.user.id;

    const restaurant = await safeDb(
      () => prisma.restaurant.findUnique({ where: { id: restaurantId } }),
      "restaurant.findUnique"
    );

    if (!restaurant || restaurant.ownerId !== userID) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
    }

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Interner Serverfehler" }, { status: 500 });
  }
}
