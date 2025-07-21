import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data) {
      return NextResponse.json({ message: "No data received" }, { status: 400 });
    }

    const result = await main(data);
    if (result && result.userID) {
      return NextResponse.json(
        { message: "Login Successful", id: result.userID, role: result.role },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Login Failed" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

async function main(data) {
  const { email, password, userIP } = data;
  console.log("Checking user with email and password:", email, password, userIP);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("User not found");
    return null;
  }

  if (user.password !== password) {
    console.log("Password mismatch");
    return null;
  }

  console.log("User authenticated:", user.id, user.role);
  return { userID: user.id, role: user.role };
}
