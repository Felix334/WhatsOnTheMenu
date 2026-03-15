// /app/api/payment/checkout/route.js
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_TEST ?? process.env.STRIPE_SECRET_KEY,
  { apiVersion: "2024-06-20" }
);

export async function POST(request) {
  const session = await getServerSession(authOptions);
  console.log("API checkout called");

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { tier = "pro", restaurant } = body;

  // Price mapping (ENV Variable nutzen!)
  const priceMap = {
    pro: process.env.STRIPE_PRICE_PRO, // z.B. "price_123abc..."
  };
  const priceId = priceMap[tier];
  if (!priceId) {
    return new Response("Invalid tier", { status: 400 });
  }

  let customerId = session.user.stripeCustomerId;

  // 1️⃣ Stripe Customer erstellen, falls nicht vorhanden
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;

    // 2️⃣ RestaurantQueue Eintrag erstellen
    await prisma.restaurantQueue.create({
      data: {
        name: restaurant.restaurantName || restaurant.name,
        ownerId: session.user.id,
        status: "pending",
        subscription: tier.toUpperCase(), // "PRO" etc.
        email: restaurant.email,
        phoneNumber: restaurant.phone,
        category: restaurant.category,
        street: restaurant.street,
        houseNumber: restaurant.houseNumber,
        city: restaurant.city,
        postalCode: restaurant.postalCode,
        country: restaurant.country || "DE",
      },
    });

    // 3️⃣ User aktualisieren
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stripeCustomerId: customerId,
        role: "Owner",
        subscription: tier.toUpperCase(),
        subscriptionStatus: "pending", // wird aktiviert via Webhook
      },
    });
  }

  // 4️⃣ Checkout Session erstellen
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const successUrl = `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/pricing/cancel?cancelled=true`;

  console.log("Creating Stripe Checkout session:", { successUrl, cancelUrl });

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: session.user.id,
      tier,
    },
  });

  return new Response(JSON.stringify({ url: checkoutSession.url }), {
    headers: { "Content-Type": "application/json" },
  });
}