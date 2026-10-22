import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { subdomainSchema, SUBDOMAIN_SUBSCRIPTIONS } from "@/lib/schemas/subdomain";

// Nur der Owner des Restaurants darf die Subdomain lesen und ändern.
// Das Abo wird frisch aus der DB geprüft, nie aus dem JWT.
async function assertOwner(req, restaurantId) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Owner") return { ok: false, status: 401, message: "Not Authorized" };

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { ownerId: true, subdomain: true, owner: { select: { subscription: true } } },
  });
  if (!restaurant) return { ok: false, status: 404, message: "Restaurant not found" };
  if (restaurant.ownerId !== token.id) return { ok: false, status: 401, message: "Unauthorized" };
  if (!SUBDOMAIN_SUBSCRIPTIONS.includes(restaurant.owner.subscription)) {
    return { ok: false, status: 403, message: "Eine eigene Subdomain gibt es nur im Professional- oder Business-Abo" };
  }

  return { ok: true, restaurant };
}

export async function GET(req) {
  try {
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");
    if (!restaurantId) return NextResponse.json({ message: "restaurantId is required" }, { status: 400 });

    const access = await assertOwner(req, restaurantId);
    if (!access.ok) return NextResponse.json({ message: access.message }, { status: access.status });

    return NextResponse.json({ subdomain: access.restaurant.subdomain ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Body: { restaurantId, subdomain } — subdomain = null entfernt sie wieder
export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const restaurantId = body?.restaurantId;
    if (typeof restaurantId !== "string" || !restaurantId) {
      return NextResponse.json({ message: "restaurantId is required" }, { status: 400 });
    }

    let subdomain = null;
    if (body.subdomain !== null) {
      const parsed = subdomainSchema.safeParse(body.subdomain);
      if (!parsed.success) {
        return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Ungültige Subdomain" }, { status: 400 });
      }
      subdomain = parsed.data;
    }

    const access = await assertOwner(req, restaurantId);
    if (!access.ok) return NextResponse.json({ message: access.message }, { status: access.status });

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { subdomain },
      select: { subdomain: true },
    });

    return NextResponse.json({ subdomain: updated.subdomain ?? null });
  } catch (error) {
    // Unique-Constraint: Subdomain gehört schon einem anderen Restaurant
    if (error?.code === "P2002") {
      return NextResponse.json({ message: "Diese Subdomain ist bereits vergeben" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
