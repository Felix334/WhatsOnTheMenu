import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe, webhookSecret, getSubscriptionTier } from "@/lib/stripe";

export async function POST(req) {
  const body = await req.text();

  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
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
          console.warn("Missing userId or subscriptionId in metadata");
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
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

        if (restaurantDetailsStr) {
          const restaurantDetails = JSON.parse(restaurantDetailsStr);

          const existingRestaurant = await prisma.restaurant.findUnique({
            where: { ownerId: userId },
          });

          if (!existingRestaurant) {
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
                owner: { connect: { id: userId } },
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
            console.log(`Restaurant created for ${userId}`);
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        await prisma.user.updateMany({
          where: { stripeCustomerId: invoice.customer },
          data: { subscriptionStatus: "active" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await prisma.user.updateMany({
          where: { stripeCustomerId: invoice.customer },
          data: { subscriptionStatus: "past_due" },
        });
        break;
      }

      // Abo vollständig beendet → auf FreeTier downgraden
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            subscription: "FreeTier",
            subscriptionStatus: "canceled",
            stripeSubscriptionId: null,
            stripePriceId: null,
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
