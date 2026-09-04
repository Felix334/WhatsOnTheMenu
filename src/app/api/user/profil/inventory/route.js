import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInventoryAccess } from "@/lib/inventoryAuth";
import { inventoryItemSchema } from "@/lib/schemas/inventory";

export async function GET(req) {
  try {
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");
    if (!restaurantId) {
      return NextResponse.json({ message: "restaurantId is required" }, { status: 400 });
    }

    const access = await assertInventoryAccess(req, restaurantId);
    if (!access.ok) {
      return NextResponse.json({ message: access.message }, { status: access.status });
    }

    const items = await prisma.inventoryItem.findMany({
      where: { restaurantID: restaurantId },
      orderBy: { name: "asc" },
      include: { supplier: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const { restaurantId } = body ?? {};
    if (!restaurantId) {
      return NextResponse.json({ message: "restaurantId is required" }, { status: 400 });
    }

    const access = await assertInventoryAccess(req, restaurantId);
    if (!access.ok) {
      return NextResponse.json({ message: access.message }, { status: access.status });
    }

    const parsed = inventoryItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Ungültige Daten" }, { status: 400 });
    }
    const data = parsed.data;

    if (data.supplierId) {
      const supplier = await prisma.supplier.findFirst({
        where: { id: data.supplierId, restaurantID: restaurantId },
        select: { id: true },
      });
      if (!supplier) {
        return NextResponse.json({ message: "Lieferant gehört nicht zu diesem Restaurant" }, { status: 400 });
      }
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name: data.name,
        unit: data.unit,
        currentStock: data.currentStock,
        minStock: data.minStock,
        costPerUnit: data.costPerUnit,
        supplierId: data.supplierId || null,
        restaurantID: restaurantId,
      },
      include: { supplier: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
