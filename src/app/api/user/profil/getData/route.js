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
      return NextResponse.json({ status: 400, error: "No data provided" });
    }
    const id = data.userID;

    if (!id) {
      return NextResponse.json({ status: 400, error: "userID is required" });
    }
    if (id !== token.id) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const userData = await main(id);

    if (!userData) {
      return NextResponse.json({ status: 404, error: "User not found" });
    }

    return NextResponse.json({ status: 200, userData });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ status: 500, error: "Internal server error" });
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
                font: true,
                heroColor: true,
                heroTextColor: true,
                createdAt: true,
                updatedAt: true,
                categoryGroup: {
                  select: {
                    id: true,
                    name: true,
                    position: true,
                    color: true,
                    fontColor: true,
                    borderRadius: true,
                    titleAlign: true,
                    categories: {
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
                        dishes: {
                          select: {
                            id: true,
                            name: true,
                            description: true,
                            price: true,
                            imageUrl: true,
                            createdAt: true,
                            updatedAt: true,
                            stock: true,
                            ingredients: true,
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
