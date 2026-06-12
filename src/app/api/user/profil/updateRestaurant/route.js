import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const { restaurantID } = await req.json();

    if (!restaurantID) {
      return NextResponse.json({ message: "Missing restaurantID" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      include: { locations: true, owner: { select: { id: true, name: true } } },
    });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    if (restaurant.ownerId !== token.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ message: "Restaurant data retrieved", data: { userData: { restaurant } } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const body = await req.json();
    const { restaurant, locations } = body;

    if (!restaurant?.id) {
      return NextResponse.json({ message: "Restaurant data is required" }, { status: 400 });
    }

    const restaurantID = restaurant.id;

    const updatedRestaurant = await prisma.$transaction(async (tx) => {
      const existing = await tx.restaurant.findUnique({
        where: { id: restaurantID },
        select: { ownerId: true },
      });

      if (!existing) throw new Error("NOT_FOUND");
      if (existing.ownerId !== token.id) throw new Error("UNAUTHORIZED");

      const restaurantData = Object.fromEntries(
        Object.entries({
          name: restaurant.name,
          description: restaurant.description,
          parentCompany: restaurant.parentCompany,
          openingHours: restaurant.openingHours,
          socialLinks: restaurant.socialLinks,
        }).filter(([, v]) => v !== undefined)
      );

      const locationOps = (locations ?? []).map((location) => {
        const { id, ...rest } = location;
        const locationData = Object.fromEntries(
          Object.entries(rest).filter(([, v]) => v !== undefined)
        );
        if (id) {
          return Object.keys(locationData).length > 0
            ? tx.location.update({ where: { id, restaurantId: restaurantID }, data: locationData })
            : null;
        }
        return tx.location.create({ data: { ...locationData, restaurantId: restaurantID } });
      }).filter(Boolean);

      await Promise.all([
        Object.keys(restaurantData).length > 0
          ? tx.restaurant.update({ where: { id: restaurantID }, data: restaurantData })
          : null,
        ...locationOps,
      ].filter(Boolean));

      return tx.restaurant.findUnique({
        where: { id: restaurantID },
        include: { locations: true, owner: { select: { id: true, name: true } } },
      });
    });

    return NextResponse.json({
      message: "Restaurant updated successfully",
      data: { userData: { restaurant: updatedRestaurant } },
    });
  } catch (error) {
    if (error.message === "NOT_FOUND")
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.error(error);
    return NextResponse.json({ message: "Failed to update restaurant" }, { status: 500 });
  }
}
