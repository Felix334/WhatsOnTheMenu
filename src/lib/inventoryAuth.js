import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getStaffAccess, can } from "@/lib/staffAuth";

// Inventar (Bestand/Einkaufsliste/Lieferanten) ist ein Premium-Feature
// (nur Professional), serverseitig immer frisch aus der DB geprüft — nie
// aus dem JWT (Sicherheits-Grundsatz). Muster wie assertCalendarAccess.
export async function assertInventoryAccess(req, restaurantId) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  if (token.role === "Owner") {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true, owner: { select: { subscription: true } } },
    });

    if (!restaurant || restaurant.ownerId !== token.id) {
      return { ok: false, status: 401, message: "Unauthorized" };
    }
    if (restaurant.owner.subscription !== "Professional") {
      return { ok: false, status: 403, message: "Inventar ist ein Professional-Feature" };
    }

    return { ok: true, token, subscription: restaurant.owner.subscription };
  }

  // Nicht-Owner: nur Staff mit Manager-Rolle (getStaffAccess prüft bereits
  // Restaurant-Zugehörigkeit, Owner-Abo "Professional" und approved-Flag)
  const access = await getStaffAccess(req, restaurantId);
  if (!can(access, "inventory")) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  return { ok: true, token, subscription: "Professional" };
}
