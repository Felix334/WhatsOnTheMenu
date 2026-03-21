import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { metadata } from "src/app/layout";
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST ?? process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

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

  console.log("Check Before Save Restaurant:", {
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
  if (user) {
    console.log("Benutzer gefunden(postRequest):", user);
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
    console.log("Restaurant existiert bereits an dieser Adresse");
    return NextResponse.json({ message: "Restaurant existiert bereits an dieser Adresse" }, { status: 409 });
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
            city: city,
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
                subscription: subscription,
              },
            });
          })
          .then(async () => {
            try {
              const customer = await stripe.customers.create({
                email: owner.email,
                metadata: { userId: ownerId },
              });
              console.log("Stripe-Event:", customer);
            } catch (err) {
              switch (err.type) {
                case "StripeCardError":
                  // A declined card error
                  console.log("Status:", err.statusCode);
                  console.log("Code:", err.code);
                  if (err.decline_code) console.log("Decline code:", err.decline_code);
                  if (err.param) console.log("Param:", err.param);
                  console.log("Message:", err.message);
                  console.log("Request ID:", err.requestId);
                  break;
                case "StripeRateLimitError":
                  // Too many requests made to the API too quickly
                  console.log("Request ID:", err.requestId);
                  break;
                case "StripeInvalidRequestError":
                  // Invalid parameters were supplied to Stripe's API
                  console.log("Message:", err.message);
                  if (err.param) console.log("Param:", err.param);
                  console.log("Request ID:", err.requestId);
                  break;
                case "StripeAPIError":
                  // An error occurred internally with Stripe's API
                  console.log("Request ID:", err.requestId);
                  break;
                case "StripeConnectionError":
                  // Some kind of error occurred during the HTTPS communication
                  console.log("Request ID:", err.requestId);
                  break;
                case "StripeAuthenticationError":
                  // You probably used an incorrect API key
                  console.log("Request ID:", err.requestId);
                  break;
                default:
                  if (err instanceof stripe.errors.StripeError) {
                    // All other Stripe errors
                    console.log("Status: " + err.statusCode);
                    console.log("Code: " + err.code);
                    console.log("Message: " + err.message);
                    console.log("Request ID: " + err.requestId);
                  } else {
                    // Handle any other types of unexpected errors
                    throw err;
                  }
                  break;
              }
            }
          });
      } catch (err) {
        console.log(err);
      }finally{
        try{
          const subscription = await stripe.subscription.create({
            customer: customer.id,
            item: []
          })
        }
      }
    }
  }
}
