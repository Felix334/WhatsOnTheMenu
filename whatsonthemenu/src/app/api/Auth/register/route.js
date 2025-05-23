import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  async function main() {
    const { name, email, password } = await req.json();
    console.log("Daten empfangen:",name, email, password)
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        passwordHash: password,
        role: "User"
      },
    });
    console.log("Created User:", newUser);
    const allUsers = await prisma.user.findMany();
    console.log("All Users:", allUsers);
  }
  main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
    return NextResponse.json({
        error: "Error creating user",
    })
  })
  .finally(async () => {
    await prisma.$disconnect();
    return NextResponse.json({
        status: 200,
    })
  });
}