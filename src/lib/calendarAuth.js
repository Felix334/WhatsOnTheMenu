import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getStaffAccess, can } from "@/lib/staffAuth";

// Kalender-Einträge (Aktionen/Events) sind ein Premium-Feature (Professional/Business),
// serverseitig immer frisch aus der DB geprüft — nie aus dem JWT (Sicherheits-Grundsatz).
// FreeTier/NoSubscription haben keinen Zugriff; Professional/Business haben je ein Limit.
export const CALENDAR_ENTRY_LIMITS = {
  Professional: 50,
  Business: 15,
};

export async function assertCalendarAccess(req, restaurantId) {
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
    if (!["Professional", "Business"].includes(restaurant.owner.subscription)) {
      return { ok: false, status: 403, message: "Events sind ein Premium-Feature" };
    }

    return { ok: true, token, subscription: restaurant.owner.subscription };
  }

  // Nicht-Owner: nur Staff mit Manager-Rolle (getStaffAccess prüft bereits
  // Restaurant-Zugehörigkeit, Owner-Abo "Professional" und approved-Flag)
  const access = await getStaffAccess(req, restaurantId);
  if (!can(access, "calendar")) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  return { ok: true, token, subscription: "Professional" };
}
