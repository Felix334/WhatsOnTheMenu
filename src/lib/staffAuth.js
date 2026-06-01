import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { permission } from "process";

const ROLE_PERMISSIONS = {
  manager: ["orders", "availability", "staff_view"],
  waiter:  ["orders"],
  kitchen: ["availability"],
};

/**
 * Gibt die Staff-Rolle des eingeloggten Users für ein Restaurant zurück.
 * Gibt null zurück wenn kein Zugriff.
 */
export async function getStaffAccess(req, restaurantId) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  // Owner hat immer vollen Zugriff
  if (session.user.role === "Owner") {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true },
    });
    if (restaurant?.ownerId === session.user.id) {
      return { role: "owner", permissions: ["orders", "availability", "staff_view", "settings"] };
    }
  }
  if(session.user.restaurantStaff === "kitchen" || session.user.staffMemberships === "waiter" || session.user.staffMemberships === "manager"){
    return {permission : ["order"]}
  }
  if(session.user.restaurantStaff === "manager"){
    return {role: session.user.restaurantStaff ,permissions: ["orders", "availability", "staff_view", "settings"]}
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
