import { NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { getToken } from "next-auth/jwt";
import { devLog } from "src/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    const id = data.userID;

    if (!id) {
      return NextResponse.json({ error: "userID is required" }, { status: 400 });
    }
    if (id !== token.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userData = await main(id);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ userData });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function main(userId) {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        subscription: true,
        subscriptionStatus: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            description: true,
            parentCompany: true,
            ownerName: true,
            category: true,
            openingHours: true,
            socialLinks: true,
            createdAt: true,
            locations: true,
            menu: {
              select: {
                id: true,
                name: true,
                description: true,
                bgColor: true,
                fontColor: true,
                font: true,
                headingFont: true,
                density: true,
                heroColor: true,
                heroTextColor: true,
                createdAt: true,
                updatedAt: true,
                // Sortierung auf allen drei Ebenen serverseitig — der Editor
                // rendert die Listen unverändert durch, und die Gastansicht
                // (api/restaurant/[restaurantID]/menu/data.js) sortiert gleich.
                categoryGroup: {
                  orderBy: { position: "asc" },
                  select: {
                    id: true,
                    name: true,
                    position: true,
                    color: true,
                    fontColor: true,
                    borderRadius: true,
                    titleAlign: true,
                    categories: {
                      orderBy: [{ position: "asc" }, { name: "asc" }],
                      select: {
                        id: true,
                        name: true,
                        description: true,
                        position: true,
                        bgColor: true,
                        font: true,
                        fontColor: true,
                        borderRadius: true,
                        elevated: true,
                        leaderDots: true,
                        titleAlign: true,
                        titleUppercase: true,
                        dishes: {
                          orderBy: [{ position: "asc" }, { createdAt: "asc" }],
                          select: {
                            id: true,
                            name: true,
                            description: true,
                            price: true,
                            imageUrl: true,
                            position: true,
                            createdAt: true,
                            updatedAt: true,
                            stock: true,
                            allergens: true,
                            reviews: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    devLog("User data found(/profil/getData): ", userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error;
  }
}
