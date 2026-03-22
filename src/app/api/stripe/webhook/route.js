import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe, webhookSecret, getSubscriptionTier } from "@/lib/stripe";

export async function POST(req) {
  const body = await req.text();
  console.log("Stripe Webhook:", body)

  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    console.error("Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription;
        const tier = session.metadata?.tier || "pro";
        const restaurantDetailsStr = session.metadata?.restaurantDetails;

        if (!userId || !subscriptionId) {
          console.warn("Missing userId or subscriptionId");
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        const priceId = subscription.items.data[0].price.id;
        const subscriptionTier = getSubscriptionTier(tier);

        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            subscriptionStatus: "active",
            subscription: subscriptionTier,
            role: "Owner",
          },
        });

        console.log(`✅ Updated user ${userId} -> ${subscriptionTier}`);

        // =========================
        // CREATE RESTAURANT
        // =========================
        if (restaurantDetailsStr) {
          try {
            const restaurantDetails = JSON.parse(restaurantDetailsStr);

            const user = await prisma.user.findUnique({
              where: { id: userId },
              select: { name: true },
            });

            await prisma.restaurant.create({
              data: {
                name: restaurantDetails.restaurantName || "New Restaurant",
                parentCompany: "Single",
                ownerName: user?.name || "Owner",
                category: restaurantDetails.category || "Other",

                owner: {
                  connect: { id: userId },
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
                    street: restaurantDetails.street,
                    houseNumber: restaurantDetails.houseNumber,
                    city: restaurantDetails.city,
                    postalCode: restaurantDetails.postalCode,
                    country: restaurantDetails.country || "DE",
                  },
                },
              },
            });

            console.log(`🏪 Restaurant created for ${userId}`);
          } catch (err) {
            console.error("Restaurant creation failed:", err);
          }
        }

        break;
      }

      // =========================
      // INVOICE PAID
      // =========================
      case "invoice.paid": {
        const invoice = event.data.object;
        console.log(`💰 Subscription renewed: ${invoice.subscription}`);

        await prisma.user.updateMany({
          where: { stripeCustomerId: invoice.customer },
          data: { subscriptionStatus: "active" },
        });

        break;
      }

      // =========================
      // PAYMENT FAILED
      // =========================
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.log(`❌ Payment failed: ${invoice.subscription}`);

        await prisma.user.updateMany({
          where: { stripeCustomerId: invoice.customer },
          data: { subscriptionStatus: "past_due" },
        });

        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}