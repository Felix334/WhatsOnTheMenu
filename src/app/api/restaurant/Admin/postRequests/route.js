import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session && !token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const requests = body?.requests || [];

    const results = [];

    for (const reqItem of requests) {
      const result = await processRequest(reqItem);
      results.push(result);
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

async function processRequest(data) {
  const { category, city, country, description, email, houseNumber, phoneNumber, postalCode, restaurantName, street, subscription, owner, name } = data;

  const ownerId = owner?.id;

  // Required fields check
  const requiredFields = {
    category, city, country, description, email, houseNumber, ownerId, postalCode, restaurantName, street, name, subscription
  };

  const missingField = Object.entries(requiredFields).find(([key, value]) => !value);

  if (missingField) {
    return { status: 400, message: `Missing field: ${missingField[0]}` };
  }

  // Check user
  const user = await prisma.user.findUnique({
    where: { id: ownerId },
  });

  if (!user) {
    return { status: 404, message: "Owner not found" };
  }

  // Check duplicate location
  const existingLocation = await prisma.location.findFirst({
    where: { street, houseNumber, postalCode },
  });

  if (existingLocation) {
    return { status: 409, message: "Restaurant exists at this address" };
  }

  try {
    // Create restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        parentCompany: "Parent Company",
        category,
        ownerName: name,
        owner: { connect: { id: ownerId } },
        menu: {
          create: {
            name: "Standard Menü",
            description: "Default Menü",
            bgColor: "#ffffff",
            font: "Inter",
          },
        },
        locations: {
          create: {
            street, houseNumber, city, postalCode, country,
          },
        },
      },
    });

    // Cleanup queue, update user
    await prisma.restaurantQueue.deleteMany({ where: { ownerId } });
    await prisma.user.update({
      where: { id: ownerId },
      data: { role: "Owner", subscription },
    });

    return { status: 200, restaurant };
  } catch (err) {
    console.error("Error:", err);
    return { status: 500, message: "Internal Error" };
  }
}
