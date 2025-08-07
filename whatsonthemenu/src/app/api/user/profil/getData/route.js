import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  var data = await req.json();
  if (!data) {
    return NextResponse.json({ status: 400 });
  }
  console.log("Empfangene Daten", data);
  const id = data.userID;
  console.log("UserID suchen:", id);
  var data = await main(id);
  if (data.status === 401) {
    return NextResponse.json({ status: 401 });
  }
  return NextResponse.json({ status: 200, userData: data });
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
                        ingredients: true, // Include ingredients for each dish
                        reviews: true,     // Include reviews for each dish
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
    console.log(userData)
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Rethrow the error for further handling if needed
  } finally {
    await prisma.$disconnect(); // Ensure the database connection is closed
  }

// Connect mit Restaurant
}