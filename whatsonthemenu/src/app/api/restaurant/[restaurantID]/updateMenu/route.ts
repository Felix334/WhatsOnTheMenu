import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextAuthHandlerParams } from "next-auth/core";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { restaurantID: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Owner") {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  const { restaurantID } = await params;

  if (!restaurantID) {
    return NextResponse.json({ message: "Invalid restaurant ID" }, { status: 400 });
  }

  try {
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

export async function POST(req: NextRequest, { params }: { params: { restaurantID: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Owner") {
    return NextResponse.json({ message: "Unauthorized?" }, { status: 401 });
  }

  const { restaurantID } = await params;
  const { bgColor, font } = await req.json();
  console.log(bgColor, font);

  if (!restaurantID) {
    return NextResponse.json({ message: "Invalid restaurant ID" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantID },
    select: { ownerId: true }
  });

  if (!restaurant) {
    return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
  }

  if (restaurant.ownerId !== token.id) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  console.log("Neuer Hintergrund:", bgColor, "Neuer Font:", font);

  if (!bgColor || !font) {
    return NextResponse.json({ message: "bgColor and font are required" }, { status: 400 });
  }

  try {
    const updatedMenu = await prisma.menu.updateMany({
      where: { restaurantId: restaurantID },
      data: {
        bgColor,
        font,
      },
    });

    if (updatedMenu.count === 0) {
      return NextResponse.json({ message: "Menu not found" }, { status: 404 });
    }

    // Fetch the updated menu
    const menu = await prisma.menu.findFirst({
      where: { restaurantId: restaurantID },
    });

    return NextResponse.json({ message: "Menu updated successfully", data: menu });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update menu" }, { status: 500 });
  }
}
