import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { devLog } from "@/lib/logger";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "Admin") {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    devLog("Check1", token.role, token.id);

    const data = await req.json();
    let searchData = data?.search || null;

    const userData = await handleUserRequest(token.role, searchData);
    devLog("User Data:", userData);

    if (!userData || userData.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    return NextResponse.json({ data: userData });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

async function handleUserRequest(role, searchData) {
  devLog("Check2", role);

  if (role === "Admin") {
    if (!searchData) {
      const userList = await prisma.user.findMany({
        skip: 0,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          subscriptionStatus: true
        },
      });
      devLog("User List:", userList);
      return userList;
    }
  }

  return null;
}
