import { NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json().catch(() => null);

  try {
    if (data?.name) {
      const users = await prisma.user.findMany({
        where: {
          name: { contains: data.name, mode: "insensitive" },
          role: "Owner",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          subscription: true,
          subscriptionStatus: true,
          image: true,
          createdAt: true,
        },
      });
      return NextResponse.json({ status: 200, data: users });
    }

    const users = await prisma.user.findMany({
      take: 20,
      skip: 0,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscription: true,
        subscriptionStatus: true,
        image: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ status: 200, data: users });
  } catch (e) {
    console.error("Database Error", e);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
