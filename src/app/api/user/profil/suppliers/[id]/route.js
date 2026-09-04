import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInventoryAccess } from "@/lib/inventoryAuth";
import { supplierSchema } from "@/lib/schemas/inventory";

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

    const parsed = supplierSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Ungültige Daten" }, { status: 400 });
    }
    const data = parsed.data;

    const result = await prisma.supplier.updateMany({
      where: { id, restaurantID: restaurantId },
      data: {
        name: data.name,
        contactName: data.contactName || null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        street: data.street || null,
        houseNumber: data.houseNumber || null,
        postalCode: data.postalCode || null,
        city: data.city || null,
        country: data.country || null,
        monthlyCost: data.monthlyCost ?? null,
        notes: data.notes || null,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "Lieferant nicht gefunden" }, { status: 404 });
    }

    const supplier = await prisma.supplier.findUnique({ where: { id } });

    return NextResponse.json({ supplier });
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

    // Items mit diesem Lieferanten werden durch onDelete: SetNull im Schema
    // automatisch lieferantenlos, nicht mitgelöscht.
    const linkedCount = await prisma.inventoryItem.count({
      where: { supplierId: id, restaurantID: restaurantId },
    });

    const result = await prisma.supplier.deleteMany({
      where: { id, restaurantID: restaurantId },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "Lieferant nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json({
      message: linkedCount > 0 ? `Lieferant gelöscht — ${linkedCount} Item(s) sind jetzt ohne Lieferant` : "Lieferant gelöscht",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
