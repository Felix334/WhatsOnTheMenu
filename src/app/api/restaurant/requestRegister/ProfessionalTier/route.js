import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Validate required fields (same as FreeTier)
    const { ownerName, name, email, postalCode, city, street, houseNumber, phone, category } = data;
    if (!ownerName || !name || !email || !postalCode || !city || !street || !houseNumber || !phone || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const restaurantQueue = await prisma.restaurantQueue.create({
      data: {
        name: name,
        restaurantName,
        ownerId: session.user.id,
        status: "pending",
        email,
        phoneNumber: phone,
        category,
        street,
        houseNumber,
        city,
        postalCode,
        country: "DE", // Default
        subscription: "Pro", // Paid tier
        ...data, // Additional fields like description, website
      },
    });

    return NextResponse.json({ 
      message: "Professional tier restaurant request created successfully!", 
      id: restaurantQueue.id 
    });
  } catch (error) {
    console.error("ProfessionalTier error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
