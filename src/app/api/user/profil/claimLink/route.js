import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { CLAIM_TTL_MS, canBuildClaims, claimCreateSchema, generateClaimToken, hashClaimToken } from "@/lib/schemas/claim";

// Übernahme-Link für das eigene Restaurant (nur Bau-Accounts, siehe CLAIM_BUILDER_EMAILS).
// Rolle, Abo und Besitz werden aus der DB gelesen, nicht aus dem Token.
async function loadBuilder(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: token.id },
    select: { id: true, email: true, role: true, stripeSubscriptionId: true, restaurant: { select: { id: true } } },
  });
  if (!canBuildClaims(user) || !user.restaurant) return null;
  return user;
}

export async function GET(req) {
  const user = await loadBuilder(req);
  if (!user) return NextResponse.json({ allowed: false });

  const claim = await prisma.restaurantClaim.findUnique({
    where: { restaurantId: user.restaurant.id },
    select: { email: true, expiresAt: true },
  });
  const active = claim && claim.expiresAt > new Date() ? claim : null;

  return NextResponse.json({ allowed: true, claim: active });
}

// Erzeugt einen neuen Link; ein vorher erzeugter Link wird dadurch ungültig.
export async function POST(req) {
  const user = await loadBuilder(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = claimCreateSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Ungültige Eingaben" }, { status: 400 });
  }

  const token = generateClaimToken();
  const data = {
    tokenHash: hashClaimToken(token),
    email: parsed.data.email ?? null,
    expiresAt: new Date(Date.now() + CLAIM_TTL_MS),
  };

  const claim = await prisma.restaurantClaim.upsert({
    where: { restaurantId: user.restaurant.id },
    create: { restaurantId: user.restaurant.id, ...data },
    update: { ...data, createdAt: new Date() },
    select: { email: true, expiresAt: true },
  });

  // Klartext-Token nur dieses eine Mal — danach liegt nur noch der Hash vor.
  return NextResponse.json({ token, claim }, { status: 201 });
}

export async function DELETE(req) {
  const user = await loadBuilder(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

  await prisma.restaurantClaim.deleteMany({ where: { restaurantId: user.restaurant.id } });
  return NextResponse.json({ message: "Link widerrufen" });
}
