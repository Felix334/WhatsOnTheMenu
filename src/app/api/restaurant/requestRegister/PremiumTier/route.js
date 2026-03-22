import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }
    if(session.user.role === "Owner"){
      return NextResponse.json({message: "User hat bereits Rolle Owner"}, { status: 409 })
    }
    const body = await req.json();

    const { ownerName, restaurantName, email, postalCode, city, street, houseNumber, phone, category, description, ownerID, subscription } = body;

    console.log(`OwnerName:${ownerName}, RestaurantName:${restaurantName}, Email:${email}, PLZ:${postalCode}, Stadt:${city}, Straße: ${street}`);
    console.log(`Hausnummer:${houseNumber}, Nummer:${phone}, Kattegory:${category}, Beschreibung:${description}, OwnerID:${ownerID}`);

    const errors = [];

    if (!ownerID) {
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

    const plzRegex = /^\d{5}$/;

    if (!postalCode || !plzRegex.test(postalCode)) {
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
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Check existing queue
    const existingQueue = await prisma.restaurantQueue.findUnique({
      where: { ownerId: ownerID },
    });
    if (existingQueue) {
      return NextResponse.json({ success: false, message: "Du hast bereits eine ausstehende Restaurant-Anfrage." }, { status: 409 });
    }

    // Location erstellen
    // Restaurant in Queue speichern
    let owner
    try{
    owner = await prisma.restaurantQueue.create({
      data: {
        name: ownerName,
        restaurantName: restaurantName,
        email: email,
        description: description || "",
        phoneNumber: phone,
        category: category,
        status: "pending",
        street: street,
        houseNumber: houseNumber,
        city: city,
        postalCode: postalCode,
        country: "Deutschland",
        subscription: subscription,
        owner: { connect: { id: ownerID } },
      },
    });
  }catch(err){
    console.log(err)
    if(err){
      return NextResponse.json({success: false, status: 500, message: "Es ist ein Fehler beim Speichern aufgetreten"})
    }
  }
  if(owner){
    console.log(owner)
  }

    return NextResponse.json({
      success: true,
      message: "Restaurant wurde zur Prüfung eingereicht",
      owner: owner
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Serverfehler",
      },
      { status: 500 },
    );
  }
}
