import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { authOptions } from "src/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req) {
  var body = await req.json();
  if (body.api_key !== process.env.API_KEY) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    console.log("Unautherized");
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }
  try {
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
    console.log("Gefunden:", restaurants);
    if (!restaurants) {
      console.error("Nichts gefunden");
    }

    return Response.json(restaurants, { status: 200 });
  } catch (error) {
    console.error("Error fetching restaurant requests:", error);

    return Response.json({ error: "Fehler beim Laden der Restaurant Requests" }, { status: 500 });
  }
}
