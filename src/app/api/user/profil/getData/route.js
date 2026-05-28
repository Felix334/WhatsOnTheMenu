import { NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";

// Force dynamic rendering - this route should never be statically generated
export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log("Session-Objekt", session);
  if (!session || session.user.role !== "Owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    if (!data) {
      return NextResponse.json({ status: 400, error: "No data provided" });
    }

    console.log("Empfangene Daten", data);
    const id = data.userID;
    console.log("UserID suchen:", id);

    if (!id) {
      return NextResponse.json({ status: 400, error: "userID is required" });
    }

    const userData = await main(id);
    if (userData) {
      console.log("Restaurant gefunden(user/profil/getData):", userData);
    }

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
      include: {
        restaurant: {
          include: {
            locations: true,
            menu: {
              select: {
                id: true,
                name: true,
                description: true,
                bgColor: true,
                font: true,
                heroColor: true,
                createdAt: true,
                updatedAt: true,
                categoryGroup: {
                  include: {
                    categories: {
                      include: {
                        dishes: {
                          include: {
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
    if (process.env.NODE_ENV !== "production") {
      console.log("User data found(/profil/getData): ", userData);
    }
    return userData;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error;
  }
}
