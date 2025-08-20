import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
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
            menu: {
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
    });
    
    console.log("User data found:", userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}