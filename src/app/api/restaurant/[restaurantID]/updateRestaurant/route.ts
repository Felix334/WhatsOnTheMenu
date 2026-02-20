import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "src/lib/auth";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest, { params }: { params: { restaurantID: string } }) {
  const session = await getServerSession(authOptions);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if ((!token || token.role !== "Owner") || !session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  const { restaurantID } = await params;

  if (!restaurantID) {
    return NextResponse.json({ message: "Invalid restaurant ID" }, { status: 400 });
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      include: {
        locations: true,
        owner: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Restaurant data retrieved",
      data: { userData: { restaurant } },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { restaurantID: string } }) {
  console.log("Ping")
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Owner") {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  const { restaurantID } = await params;

  if (!restaurantID) {
    return NextResponse.json({ message: "Invalid restaurant ID" }, { status: 400 });
  }

  const body = await req.json();
  const { restaurant, locations } = body;

  if (!restaurant) {
    return NextResponse.json({ message: "Restaurant data is required" }, { status: 400 });
  }

  try {
    await prisma.restaurant.update({
      where: { id: restaurantID },
      data: {
        name: restaurant.name,
        parentCompany: restaurant.parentCompany,
      },
    });

    for (const location of locations ?? []) {
      if (location.id) {
        await prisma.location.update({
          where: { id: location.id },
          data: {
            street: location.street,
            houseNumber: location.houseNumber,
            city: location.city,
            postalCode: location.postalCode,
            country: location.country,
          },
        });
      } else {
        await prisma.location.create({
          data: {
            street: location.street,
            houseNumber: location.houseNumber,
            city: location.city,
            postalCode: location.postalCode,
            country: location.country,
            restaurantId: restaurantID,
          },
        });
      }
    }

    const updatedRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      include: {
        locations: true,
        owner: true,
      },
    });

    return NextResponse.json({
      message: "Restaurant updated successfully",
      data: { userData: { restaurant: updatedRestaurant } },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update restaurant" }, { status: 500 });
  }
}
