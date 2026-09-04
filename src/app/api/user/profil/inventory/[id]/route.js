import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInventoryAccess } from "@/lib/inventoryAuth";
import { inventoryItemSchema } from "@/lib/schemas/inventory";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
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

    const result = await prisma.inventoryItem.updateMany({
      where: { id, restaurantID: restaurantId },
      data: {
        name: data.name,
        unit: data.unit,
        currentStock: data.currentStock,
        minStock: data.minStock,
        costPerUnit: data.costPerUnit,
        supplierId: data.supplierId || null,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "Item nicht gefunden" }, { status: 404 });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { supplier: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");
    if (!restaurantId) {
      return NextResponse.json({ message: "restaurantId is required" }, { status: 400 });
    }

    const access = await assertInventoryAccess(req, restaurantId);
    if (!access.ok) {
      return NextResponse.json({ message: access.message }, { status: access.status });
    }

    const result = await prisma.inventoryItem.deleteMany({
      where: { id, restaurantID: restaurantId },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "Item nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item gelöscht" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
