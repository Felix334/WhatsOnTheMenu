import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

// Gibt die eigenen Account-Daten des angemeldeten Nutzers zurück.
// Funktioniert für JEDE Rolle (nicht nur Owner) und liefert ausschließlich
// unkritische Felder (kein password / keine Stripe-IDs).
export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: token.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        subscription: true,
        subscriptionStatus: true,
        createdAt: true,
        restaurant: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/user/me error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
