import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST ?? process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription;
    const tier = session.metadata?.tier || "Pro";

    if (userId && subscriptionId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeSubscriptionId: subscriptionId,
          stripePriceId: session.line_items?.data[0]?.price?.id,
          subscriptionStatus: "active",
          subscription: tier, // Map to Prisma enum: "Pro"
        },
      });
      console.log(`Updated subscription for user ${userId}`);
    }
  }

  return NextResponse.json({ received: true });
}
