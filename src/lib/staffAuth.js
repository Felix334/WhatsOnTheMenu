import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALL_PERMISSIONS = ["orders", "availability", "staff_view", "settings", "calendar"];

const ROLE_PERMISSIONS = {
  manager: ALL_PERMISSIONS,
  waiter:  ["orders"],
  kitchen: ["availability", "orders"],
};

export async function getStaffAccess(_req, restaurantId) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const isOwner = session.user.role === "Owner";

  // Run restaurant lookup and (for non-owners) staff membership check in parallel
  const [restaurant, membership] = await Promise.all([
    prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true, owner: { select: { subscription: true } } },
    }),
    isOwner
      ? Promise.resolve(null)
      : prisma.restaurantStaff.findFirst({
          where: { userId, restaurantId, approved: true },
          select: { role: true },
        }),
  ]);

  if (!restaurant) return null;

  // Nur Professional-Restaurants dürfen das Staff-System nutzen
  if (restaurant.owner.subscription !== "Professional") return null;

  // Owner hat immer vollen Zugriff auf sein eigenes Restaurant
  if (isOwner && restaurant.ownerId === userId) {
    return { role: "owner", permissions: ALL_PERMISSIONS };
  }

  if (!membership) return null;

  return {
    role: membership.role,
    permissions: ROLE_PERMISSIONS[membership.role] ?? [],
  };
}

export function can(access, permission) {
  return access?.permissions?.includes(permission) ?? false;
}
