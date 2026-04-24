import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "src/lib/auth";
import { getToken } from "next-auth/jwt";

export async function GET(req, context) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || token.role !== "Owner" || !session) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }
    const restaurantID = context.params.restaurantID;
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

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token || token.role !== "Owner" || !session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    console.log("/updateRestaurant:", body)
    const { restaurant, locations, userID } = body;

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant data is required" }, { status: 400 });
    }

    const restaurantID = restaurant.id;
    const checkOwner = await prisma.restaurant.findUnique({ where: { id: restaurantID } });

    if (!checkOwner) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }
    if (userID !== checkOwner.ownerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dynamisches Restaurant-Update (nur geänderte Felder)
    const restaurantData = Object.fromEntries(
      Object.entries({
        name: restaurant.name,
        parentCompany: restaurant.parentCompany,
      }).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(restaurantData).length > 0) {
      await prisma.restaurant.update({
        where: { id: restaurantID },
        data: restaurantData,
      });
    }

    for (const location of locations ?? []) {
      const { id, ...rest } = location;

      const locationData = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== undefined)
      );

      if (id) {
        if (Object.keys(locationData).length > 0) {
          await prisma.location.update({
            where: { id },
            data: locationData,
          });
        }
      } else {
        await prisma.location.create({
          data: {
            ...locationData,
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