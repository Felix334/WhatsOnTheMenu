import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Pass request to getServerSession
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ status: 401, message: "Not authenticated" });
    }

    const userID = session.user.id;
    const role = session.user.role;
    console.log("Check1", role, userID);

    const data = await req.json();
    let searchData = data?.search || null;

    const userData = await handleUserRequest(role, searchData);
    console.log("User Data:", userData);

    if (!userData || userData.length === 0) {
      return NextResponse.json({ status: 404, message: "No data found" });
    }

    return NextResponse.json({ status: 200, data: userData });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ status: 500, message: "Server error" });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleUserRequest(role, searchData) {
  console.log("Check2", role);

  if (role === "Admin") {
    if (!searchData) {
      // Return first 20 users, select only necessary fields
      const userList = await prisma.user.findMany({
        skip: 0,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      console.log("User List:", userList);
      return userList;
    } 
    /*
    else {
      // Optional: filter by name
      return prisma.user.findMany({
        where: {
          name: { contains: searchData.name, mode: "insensitive" },
          role: "Owner",
        },
        select: { id: true, name: true, email: true, role: true },
      });
    }
    */
  }

  return null;
}
