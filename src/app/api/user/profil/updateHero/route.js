import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

// Muss mit den Presets in Profil/page.js (HERO_COLOR_PRESETS + Farb-Swatches) übereinstimmen.
const HERO_GRADIENT_KEYS = ["amber", "green", "blue", "red", "purple", "dark", "white"];
const HERO_PRESET_HEX = new Set([
  "#ffffff", "#f5f5f5", "#d1d5db", "#6b7280", "#1f2937", "#000000",
  "#fbbf24", "#f59e0b", "#f97316", "#f87171", "#ef4444", "#ec4899",
  "#a855f7", "#6366f1", "#60a5fa", "#22d3ee", "#34d399", "#86efac", "#fde68a",
]);

function isFreeHeroColor(value) {
  return HERO_GRADIENT_KEYS.includes(value) || HERO_PRESET_HEX.has(value?.toLowerCase());
}

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "Owner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { restaurantId, name, description, heroColor, heroTextColor } = await req.json();

    if (!restaurantId) {
      return NextResponse.json({ message: "restaurantId is required" }, { status: 400 });
    }
    if (name === undefined && description === undefined && heroColor === undefined && heroTextColor === undefined) {
      return NextResponse.json({ message: "At least one field is required" }, { status: 400 });
    }

    // Freie Hex-Farbwahl (statt der vorgegebenen Presets) ist ein Professional-Feature —
    // serverseitig aus der DB geprüft, nicht aus dem Token (kann nach Abo-Wechsel veraltet sein).
    const usesCustomHeroColor = (heroColor !== undefined && !isFreeHeroColor(heroColor))
      || (heroTextColor !== undefined && !HERO_PRESET_HEX.has(heroTextColor?.toLowerCase()));

    if (usesCustomHeroColor) {
      const user = await prisma.user.findUnique({
        where: { id: token.id },
        select: { subscription: true },
      });

      if (!user || user.subscription !== "Professional") {
        return NextResponse.json({ message: "Eigene Farbwahl ist ein Professional-Feature" }, { status: 403 });
      }
    }

    const ops = [];

    if (name !== undefined) {
      ops.push(
        prisma.restaurant.updateMany({
          where: { id: restaurantId, ownerId: token.id },
          data: { name },
        })
      );
    }
    if (description !== undefined) {
      ops.push(
        prisma.restaurant.updateMany({
          where: { id: restaurantId, ownerId: token.id },
          data: { description },
        })
      );
    }

    const menuData = Object.fromEntries(
      Object.entries({ description, heroColor, heroTextColor }).filter(([ , v]) => v !== undefined)
    );

    if (Object.keys(menuData).length > 0) {
      ops.push(
        prisma.menu.updateMany({
          where: { restaurantId, restaurant: { ownerId: token.id } },
          data: menuData,
        })
      );
    }

    const results = await Promise.all(ops);

    if (name !== undefined && results[0].count === 0) {
      return NextResponse.json({ message: "Restaurant not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Header updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
