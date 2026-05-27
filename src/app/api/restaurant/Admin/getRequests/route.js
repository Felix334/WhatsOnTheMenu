import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session || !token || token.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const restaurants = await prisma.restaurantQueue.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(restaurants, { status: 200 });
  } catch (error) {
    console.error("Error fetching restaurant requests:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Restaurant Requests" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session || !token || token.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Nur erlaubte Filter-Felder übernehmen (kein direktes where: body → Prisma-Injection)
    const body = await req.json();
    const { status, ownerId } = body ?? {};
    const restaurants = await prisma.restaurantQueue.findMany({
      where: {
        ...(status   && { status }),
        ...(ownerId  && { ownerId }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(restaurants, { status: 200 });
  } catch (error) {
    console.error("Error fetching restaurant requests:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Restaurant Requests" }, { status: 500 });
  }
}

