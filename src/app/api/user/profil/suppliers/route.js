import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInventoryAccess } from "@/lib/inventoryAuth";
import { supplierSchema } from "@/lib/schemas/inventory";

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

    const suppliers = await prisma.supplier.findMany({
      where: { restaurantID: restaurantId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ suppliers });
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

    const parsed = supplierSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Ungültige Daten" }, { status: 400 });
    }
    const data = parsed.data;

    const supplier = await prisma.supplier.create({
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
        restaurantID: restaurantId,
      },
    });

    return NextResponse.json({ supplier });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
