import { NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "Admin") {
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
      });
      return NextResponse.json({ status: 200, data: users });
    }

    const users = await prisma.user.findMany({ take: 20, skip: 0 });
    return NextResponse.json({ status: 200, data: users });
  } catch (e) {
    console.error("Database Error", e);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
