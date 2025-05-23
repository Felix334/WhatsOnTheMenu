import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    if (data) {
      console.log("Daten empfangen:", data);
      const userID = await main(data);
      if (userID) {
        return NextResponse.json({ message: "Login Successful", id: userID }, { status: 200 });
      } else {
        return NextResponse.json({ message: "Login Failed" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ message: "No data received" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

async function main(data) {
  const { email, password } = await data;
  console.log("Checking user with email and password:", email, password);
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (user) {
    console.log("User found:", user);
    if (user.passwordHash == password) {
      return user.id;
    } else {
      console.log("Password mismatch");
    }
  } else {
    console.log("User not found");
  }
  return null;
}
