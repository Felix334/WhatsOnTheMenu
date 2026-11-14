import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { CLAIM_TOKEN_PATTERN, canBuildClaims, hashClaimToken } from "@/lib/schemas/claim";

// Übernahme-Link einlösen. GET = Vorschau (welches Restaurant), POST = übernehmen.
// Ein Link ist gültig, solange er existiert, nicht abgelaufen ist und das
// Restaurant noch einem freigegebenen Bau-Account gehört.

const NOT_FOUND = { message: "Dieser Link ist ungültig, abgelaufen oder wurde bereits eingelöst." };

async function findValidClaim(db, rawToken) {
  if (!CLAIM_TOKEN_PATTERN.test(rawToken ?? "")) return null;

  const claim = await db.restaurantClaim.findUnique({
    where: { tokenHash: hashClaimToken(rawToken) },
    select: {
      id: true,
      email: true,
      expiresAt: true,
      restaurant: {
        select: {
          id: true,
          name: true,
          owner: { select: { id: true, email: true, role: true, stripeSubscriptionId: true } },
        },
      },
    },
  });
  if (!claim || claim.expiresAt <= new Date()) return null;
  if (!canBuildClaims(claim.restaurant.owner)) return null;
  return claim;
}

export async function GET(_req, { params }) {
  const { token } = await params;
  const claim = await findValidClaim(prisma, token);
  if (!claim) return NextResponse.json(NOT_FOUND, { status: 404 });

  return NextResponse.json({
    restaurantName: claim.restaurant.name,
    restrictedToEmail: Boolean(claim.email),
  });
}

class ClaimError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function POST(req, { params }) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session?.id) {
    return NextResponse.json({ message: "Bitte zuerst mit Google anmelden." }, { status: 401 });
  }
  const { token } = await params;

  try {
    const restaurantName = await prisma.$transaction(async (tx) => {
      const claim = await findValidClaim(tx, token);
      if (!claim) throw new ClaimError(NOT_FOUND.message, 404);

      const claimant = await tx.user.findUnique({
        where: { id: session.id },
        select: { id: true, email: true, role: true, stripeSubscriptionId: true, restaurant: { select: { id: true } } },
      });
      if (!claimant) throw new ClaimError("Konto nicht gefunden.", 401);

      const builder = claim.restaurant.owner;
      if (claimant.id === builder.id) {
        throw new ClaimError("Du kannst dein eigenes Restaurant nicht übernehmen — öffne den Link mit dem Konto des Kunden.", 409);
      }
      if (claim.email && claim.email !== claimant.email?.toLowerCase()) {
        throw new ClaimError("Dieser Link ist für ein anderes Google-Konto bestimmt.", 403);
      }
      // Nur einfache Nutzer übernehmen: Admins, Staff und bestehende Owner würden
      // sonst ihre Rolle bzw. ihr Restaurant/Abo verlieren oder vermischen.
      if (claimant.role !== "User" || claimant.restaurant || claimant.stripeSubscriptionId) {
        throw new ClaimError("Mit diesem Konto kann kein Restaurant übernommen werden (es ist bereits einem Restaurant oder einer Rolle zugeordnet).", 409);
      }

      // Einmalig: Löschen gelingt nur dem ersten von zwei gleichzeitigen Aufrufen.
      const removed = await tx.restaurantClaim.deleteMany({ where: { id: claim.id } });
      if (removed.count !== 1) throw new ClaimError(NOT_FOUND.message, 404);

      // Besitzwechsel nur, wenn das Restaurant noch dem Bau-Account gehört.
      const moved = await tx.restaurant.updateMany({
        where: { id: claim.restaurant.id, ownerId: builder.id },
        data: { ownerId: claimant.id },
      });
      if (moved.count !== 1) throw new ClaimError(NOT_FOUND.message, 404);

      await tx.user.update({
        where: { id: claimant.id },
        data: { role: "Owner", subscription: "FreeTier" },
      });
      // Bau-Account ist danach wieder frei für die nächste Speisekarte.
      await tx.user.update({
        where: { id: builder.id },
        data: { role: "User", subscription: "NoSubscription" },
      });

      return claim.restaurant.name;
    });

    return NextResponse.json({ message: "Restaurant übernommen", restaurantName });
  } catch (err) {
    if (err instanceof ClaimError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error("Claim error:", err);
    return NextResponse.json({ message: "Interner Serverfehler" }, { status: 500 });
  }
}
