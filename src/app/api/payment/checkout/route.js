import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { stripe, getPriceId, isTierAvailable } from "@/lib/stripe";
import { restaurantCheckoutSchema } from "@/lib/schemas/restaurant";
import { devLog, devWarn } from "@/lib/logger";

export async function POST(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.tier !== "string") {
    return new Response("Invalid request", { status: 400 });
  }
  const { tier, restaurant } = body;

  const priceId = getPriceId(tier);

  if (!priceId) {
    console.error("Invalid tier:", tier);
    return new Response("Invalid tier", { status: 400 });
  }

  // "Coming Soon"-Sperre: nicht freigegebene Tiers serverseitig ablehnen,
  // unabhängig davon, was irgendein Client anzeigt (Sicherheit vor Effizienz).
  if (!isTierAvailable(tier)) {
    return new Response("Dieses Abo ist noch nicht verfügbar", { status: 403 });
  }

  // Widerrufsbelehrung (EU-Verbraucherrecht): Ohne ausdrückliche Zustimmung zum
  // sofortigen Leistungsbeginn und Kenntnisnahme des Erlöschens des Widerrufsrechts
  // darf kein kostenpflichtiges Abo gestartet werden. Serverseitig erzwungen,
  // da Client-Checks umgehbar sind.
  if (body.withdrawalConsent !== true) {
    return new Response("Zustimmung zur Widerrufsbelehrung erforderlich", { status: 400 });
  }

  // Serverseitige Validierung der Restaurant-Metadaten (Client-Validierung ist umgehbar).
  const parsedRestaurant = restaurant
    ? restaurantCheckoutSchema.safeParse(restaurant)
    : { success: true, data: undefined };
  if (!parsedRestaurant.success) {
    return new Response("Invalid restaurant data", { status: 400 });
  }
  const restaurantData = parsedRestaurant.data;

  const dbUser = await prisma.user.findUnique({
    where: { id: token.id },
    select: { stripeCustomerId: true, stripeSubscriptionId: true, subscriptionStatus: true },
  });

  if (dbUser?.stripeSubscriptionId && dbUser?.subscriptionStatus === "active") {
    return new Response("Already subscribed", { status: 409 });
  }

  let customerId = dbUser?.stripeCustomerId;

  if (customerId) {
    try {
      const existing = await stripe.customers.retrieve(customerId);
      if (existing.deleted) {
        devWarn("Stripe customer was deleted, creating new one:", customerId);
        customerId = null;
      }
    } catch (err) {
      if (err?.code === "resource_missing" || err?.statusCode === 404) {
        devWarn("Stripe customer not found, creating new one:", customerId);
        customerId = null;
      } else {
        console.error("Customer retrieval failed:", err);
        return new Response("Customer error", { status: 500 });
      }
    }
  }

  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: token.email,
        metadata: { userId: token.id },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: token.id },
        data: { stripeCustomerId: customerId },
      });

      devLog("Created customer:", customerId);
    } catch (err) {
      console.error("Customer creation failed:", err);
      return new Response("Customer error", { status: 500 });
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.whatisonmymenu.com";
  const successUrl = `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/pricing/cancel?cancelled=true`;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: token.id,
        tier,
        // Nachweis der Widerrufs-Zustimmung (Zeitpunkt der Checkout-Erstellung)
        withdrawalConsentAt: new Date().toISOString(),
        restaurantDetails: JSON.stringify({
          restaurantName: restaurantData?.restaurantName || "",
          category: restaurantData?.category || "",
          street: restaurantData?.street || "",
          houseNumber: restaurantData?.houseNumber || "",
          postalCode: restaurantData?.postalCode || "",
          city: restaurantData?.city || "",
          country: restaurantData?.country || "DE",
        }),
      },
    });

    return new Response(
      JSON.stringify({ url: checkoutSession.url }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Checkout creation failed:", err);
    return new Response("Checkout error", { status: 500 });
  }
}
