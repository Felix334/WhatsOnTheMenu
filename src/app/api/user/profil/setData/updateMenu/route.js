import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function GET(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const { restaurantID } = await params;

    if (!restaurantID) {
      return NextResponse.json({ message: "Invalid restaurant ID" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      select: { ownerId: true },
    });

    if (!restaurant || restaurant.ownerId !== token.id) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const menu = await prisma.menu.findFirst({
      where: { restaurantId: restaurantID },
    });

    if (!menu) {
      return NextResponse.json({ message: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Menu data retrieved", data: menu });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const { bgColor, font, description, restaurantID } = await req.json();

    if (!restaurantID) {
      return NextResponse.json({ message: "Invalid restaurant ID" }, { status: 400 });
    }

    if (!bgColor && !font && description === undefined) {
      return NextResponse.json({ message: "At least one field (bgColor, font, description) is required" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      select: { ownerId: true },
    });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    if (restaurant.ownerId !== token.id) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const updateData = Object.fromEntries(
      Object.entries({ bgColor, font, description }).filter(([, v]) => v !== undefined)
    );

    const updatedMenu = await prisma.menu.updateMany({
      where: { restaurantId: restaurantID },
      data: updateData,
    });

    if (updatedMenu.count === 0) {
      return NextResponse.json({ message: "Menu not found" }, { status: 404 });
    }

    const menu = await prisma.menu.findFirst({
      where: { restaurantId: restaurantID },
    });

    return NextResponse.json({ message: "Menu updated successfully", data: menu });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update menu" }, { status: 500 });
  }
}
