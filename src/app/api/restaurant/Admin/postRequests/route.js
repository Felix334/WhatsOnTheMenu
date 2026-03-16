import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session && !token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const requests = body?.requests || [];

    console.log("Erstelle Restaurants:", requests);

    const results = [];

    for (const reqItem of requests) {
      const result = await processRequest(reqItem);
      results.push(result);
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Server Error:", err);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

async function processRequest(data) {
  const { category, city, country, description, email, houseNumber, phoneNumber, postalCode, restaurantName, street, subscription, owner, name } = data;

  const ownerId = owner?.id;

  console.log("Check Before Save:", {
    category,
    city,
    country,
    description,
    email,
    houseNumber,
    phoneNumber,
    postalCode,
    restaurantName,
    street,
    subscription,
    ownerId,
    name,
  });

  // Pflichtfelder prüfen
  const requiredFields = {
    category,
    city,
    country,
    description,
    email,
    houseNumber,
    ownerId,
    postalCode,
    restaurantName,
    street,
    name,
    subscription,
  };

  const missingField = Object.entries(requiredFields).find(([, value]) => !value);

  if (missingField) {
    console.log(`Fehlendes Feld: ${missingField[0]}`);

    return NextResponse.json({ status: 400, message: `Fehlendes Feld: ${missingField[0]}` }, { status: 400 });
  }

  // Prüfen ob User existiert
  const user = await prisma.user.findUnique({
    where: {
      id: ownerId,
    },
  });

  if (!user) {
    console.log("User nicht gefunden:", ownerId);

    return {
      status: 404,
      message: "Owner nicht gefunden",
    };
  }

  // Prüfen ob Restaurant an Adresse existiert
  const existingLocation = await prisma.location.findFirst({
    where: {
      street,
      houseNumber,
      postalCode,
    },
  });

  if (existingLocation) {
    return {
      status: 409,
      message: "Restaurant existiert bereits",
    };
  }

  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        parentCompany: "Parent Company",
        category: category,
        ownerName: name,

        owner: {
          connect: {
            id: ownerId,
          },
        },

        menu: {
          create: {
            name: "Standard Menü",
            description: "Default Menü",
            bgColor: "#ffffff",
            font: "Inter",
          },
        },

        locations: {
          create: {
            street: street,
            houseNumber: houseNumber,
            city: houseNumber,
            postalCode: postalCode,
            country: country,
          },
        },
      },
    });

    return {
      status: 200,
      restaurant,
    };
  } catch (err) {
    console.error("Database Fehler:", err);

    return {
      status: 500,
      message: "Database Fehler",
    };
  } finally {
    const checkrestaurant = await prisma.restaurant.findUnique({
      where: {
        ownerId: ownerId,
      },
    });
    if (checkrestaurant) {
      console.log("Lösche:", checkrestaurant);
      try {
        await prisma.restaurantQueue
          .delete({
            where: {
              ownerId: ownerId,
            },
          })
          .then(async () => {
            await prisma.user.update({
              where: {
                id: ownerId,
              },
              data: {
                role: "Owner",
              },
            });
          });
      } catch (err) {
        console.log(err);
      }
    }
  }
}
