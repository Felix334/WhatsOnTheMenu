import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { restaurantId, name, description, heroColor, heroTextColor } = await req.json();

    if (!restaurantId) {
      return NextResponse.json({ message: "restaurantId is required" }, { status: 400 });
    }
    if (name === undefined && description === undefined && heroColor === undefined && heroTextColor === undefined) {
      return NextResponse.json({ message: "At least one field is required" }, { status: 400 });
    }

    // Updates run in parallel — WHERE ownerId handles authorization implicitly.
    const ops = [];

    if (name !== undefined) {
      ops.push(
        prisma.restaurant.updateMany({
          where: { id: restaurantId, ownerId: token.id },
          data: { name },
        })
      );
    }
    if(description !== undefined){
      ops.push(
        prisma.restaurant.update({
          where:{id: restaurantId},
          data: {
            description: description
          }
        })
      )
    }

    const menuData = Object.fromEntries(
      Object.entries({ description, heroColor, heroTextColor }).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(menuData).length > 0) {
      ops.push(
        prisma.menu.updateMany({
          where: { restaurantId, restaurant: { ownerId: token.id } },
          data: menuData,
        })
      );
    }

    const results = await Promise.all(ops);

    if (name !== undefined && results[0].count === 0) {
      return NextResponse.json({ message: "Restaurant not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Header updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
