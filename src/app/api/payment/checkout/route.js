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

  // Price mapping (ENV Variables)
  const priceMap = {
    pro: process.env.STRIPE_PRICE_PRO,
    premium: process.env.STRIPE_PRICE_PREMIUM,
  };
  const priceId = priceMap[tier];
  if (!priceId) {
    return new Response("Invalid tier", { status: 400 });
  }

  let customerId = session.user.stripeCustomerId;

  // Create Stripe Customer if not exists
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;

    // Update user with customer ID only
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stripeCustomerId: customerId,
      },
    });
    console.log(`Created Stripe customer ${customerId} for user ${session.user.id}`);
  }

  // Checkout Session
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const successUrl = `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/pricing/cancel?cancelled=true`;

  console.log("Creating Stripe Checkout session:", { priceId, customerId, successUrl, cancelUrl });

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: session.user.id,
      tier,
      restaurantDetails: JSON.stringify(restaurant || {}),
    },
  });

  return new Response(JSON.stringify({ url: checkoutSession.url }), {
    headers: { "Content-Type": "application/json" },
  });
}

