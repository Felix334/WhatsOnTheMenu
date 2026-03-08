import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      ownerName,
      restaurantName,
      email,
      plz,
      city,
      street,
      houseNumber,
      phone,
      category,
      description,
      ownerId
    } = body;

    console.log(body)

    const errors = [];

    if (!ownerId) {
      errors.push("Owner ID fehlt.");
    }

    if (!ownerName || ownerName.length < 3) {
      errors.push("Name zu kurz.");
    }

    if (!restaurantName || restaurantName.length < 2) {
      errors.push("Restaurantname fehlt.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("Email ungültig.");
    }

    const plzRegex = /^[0-9]$/;
    if (!plz || !plzRegex.test(plz)) {
      errors.push("PLZ muss 5-stellig sein.");
    }

    if (!city || !street || !houseNumber) {
      errors.push("Adresse unvollständig.");
    }

    if (!phone || phone.length < 6) {
      errors.push("Telefonnummer ungültig.");
    }

    if (!category) {
      errors.push("Kategorie fehlt.");
      console
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Location erstellen
    const location = await prisma.location.create({
      data: {
        plz,
        city,
        street,
        houseNumber
      }
    });

    // Restaurant in Queue speichern
    await prisma.restaurantQueue.create({
      data: {
        name: ownerName,
        restaurantName,
        email,
        ownerId,
        description: description || "",
        phoneNumber: phone,
        category,
        locationId: location.id,
        subscription: "FREE",
        status: "pending"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Restaurant wurde zur Prüfung eingereicht"
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Serverfehler"
      },
      { status: 500 }
    );
  }
}