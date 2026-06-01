import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALL_PERMISSIONS = ["orders", "availability", "staff_view", "settings"];

const ROLE_PERMISSIONS = {
  manager: ALL_PERMISSIONS,
  waiter:  ["orders"],
  kitchen: ["availability", "orders"],
};

/**
 * Gibt die Staff-Rolle des eingeloggten Users für ein Restaurant zurück.
 * Gibt null zurück wenn kein Zugriff oder Owner kein Professional-Abo hat.
 */
export async function getStaffAccess(_req, restaurantId) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      ownerId: true,
      owner: { select: { subscription: true } },
    },
  });

  if (!restaurant) return null;

  // Nur Professional-Restaurants dürfen das Staff-System nutzen
  if (restaurant.owner.subscription !== "Professional") return null;

  // Owner hat immer vollen Zugriff auf sein eigenes Restaurant
  if (session.user.role === "Owner" && restaurant.ownerId === session.user.id) {
    return { role: "owner", permissions: ["orders", "availability", "staff_view", "settings"] };
  }

  const membership = await prisma.restaurantStaff.findFirst({
    where: { userId: session.user.id, restaurantId, approved: true },
    select: { role: true },
  });

  if (!membership) return null;

  return {
    role: membership.role,
    permissions: ROLE_PERMISSIONS[membership.role] ?? [],
  };
}

export function can(access, permission) {
  return access?.permissions?.includes(permission) ?? false;
}
