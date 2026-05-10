import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

async function authorize(req: Request) {
  const [session, token] = await Promise.all([
    getServerSession(authOptions),
    getToken({ req, secret: process.env.NEXTAUTH_SECRET }),
  ]);
  if (!session || !token || token.role !== "Owner") return null;
  return token;
}

export async function GET(req: Request, context: { params: { restaurantID: string } }) {
  try {
    if (!await authorize(req)) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: context.params.restaurantID },
      include: { locations: true, owner: true },
    });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Restaurant data retrieved", data: { userData: { restaurant } } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await authorize(req)) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const body = await req.json();
    const { restaurant, locations, userID } = body;

    if (!restaurant?.id) {
      return NextResponse.json({ message: "Restaurant data is required" }, { status: 400 });
    }

    const restaurantID = restaurant.id;

    // 1 query statt 2: owner-check direkt mitladen
    const existing = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      select: { ownerId: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }
    if (existing.ownerId !== userID) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const restaurantData = Object.fromEntries(
      Object.entries({
        name: restaurant.name,
        parentCompany: restaurant.parentCompany,
      }).filter(([_, v]) => v !== undefined)
    );

    const locationUpdates = (locations ?? []).map((location: any) => {
      const { id, ...rest } = location;
      const locationData = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== undefined)
      );

      if (id) {
        return Object.keys(locationData).length > 0
          ? prisma.location.update({ where: { id }, data: locationData })
          : null;
      } else {
        return prisma.location.create({ data: { ...locationData, restaurantId: restaurantID } });
      }
    }).filter(Boolean);

    await Promise.all([
      Object.keys(restaurantData).length > 0
        ? prisma.restaurant.update({ where: { id: restaurantID }, data: restaurantData })
        : null,
      ...locationUpdates,
    ].filter(Boolean));

    const updatedRestaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      include: { locations: true, owner: true },
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