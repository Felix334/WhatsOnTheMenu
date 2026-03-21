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
    console.error(`Webhook signature verification failed:`, err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription;
        const tier = session.metadata?.tier || "Pro";
        const restaurantDetailsStr = session.metadata?.restaurantDetails;

        if (userId && subscriptionId) {
          // Retrieve subscription to get price ID
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price.id;

          // Map tier to Prisma enum
          const tierMap = {
            pro: "Pro",
            premium: "Premium",
            basic: "Basic"
          };
          const subscriptionTier = tierMap[tier.toLowerCase()] || "Pro";

          // Update user subscription details
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              subscriptionStatus: "active",
              subscription: subscriptionTier,
              role: "Owner"
            },
          });

          console.log(`Updated subscription for user ${userId} to ${subscriptionTier}`);

          // Create restaurant queue if details provided
          if (restaurantDetailsStr) {
            const restaurantDetails = JSON.parse(restaurantDetailsStr);
            await prisma.restaurantQueue.create({
              data: {
                restaurantName: restaurantDetails.restaurantName || restaurantDetails.name,
                ownerId: userId,
                status: "pending",
                subscription: subscriptionTier,
                email: restaurantDetails.email,
                phoneNumber: restaurantDetails.phone || restaurantDetails.phoneNumber,
                category: restaurantDetails.category,
                street: restaurantDetails.street,
                houseNumber: restaurantDetails.houseNumber,
                city: restaurantDetails.city,
                postalCode: restaurantDetails.postalCode,
                country: restaurantDetails.country || "DE",
              },
            });
            console.log(`Created restaurantQueue for ${userId}`);
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          console.log(`Subscription ${invoice.subscription} renewed`);
        }
        break;
      }

      case "invoice.payment_failed": {
        console.log(`Payment failed for subscription ${event.data.object.subscription}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`Webhook handler error:`, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}

