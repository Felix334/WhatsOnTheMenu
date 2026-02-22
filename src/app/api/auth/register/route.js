import { NextRequest, NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const newUser  = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        role: "User",
      },
    });

    console.log("Created User:", newUser );

    const allUsers = await prisma.user.findMany();
    console.log("All Users:", allUsers);

    return NextResponse.json({ status: 201 });
  } catch (e) {
    console.error(e);

    if (e.code === 'P2002') {
      return NextResponse.json({
        error: `User  with email ${email} already exists.`,
      }, { status: 409 });
    }

    return NextResponse.json({
      error: `Error creating user: ${e.message}`,
    }, { status: 500 }); // Internal Server Error
  } finally {
    await prisma.$disconnect();
  }
}
