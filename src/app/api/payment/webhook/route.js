import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe, webhookSecret, getSubscriptionTier } from "@/lib/stripe";

export async function POST(req) {
  const body = await req.text();
  console.log("Call Webhook")

  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

    if (!signature) {
    console.error("❌ Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }
  
  let event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
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
        const userId = session.metadata.userId;
        const subscriptionId = session.subscription;
        const tier = session.metadata.tier || "pro";
        const restaurantDetailsStr = session.metadata.restaurantDetails;

        if (userId && subscriptionId) {
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
              role: "Owner"
            },
          });

          console.log(`Updated ${userId} to ${subscriptionTier}`);

          if (restaurantDetailsStr) {
            const restaurantDetails = JSON.parse(restaurantDetailsStr);
            const user = await prisma.user.findUnique({
              where: { id: userId },
              select: { name: true }
            });

            // Check if restaurant already exists
            const existingRestaurant = await prisma.restaurant.findUnique({
              where: { ownerId: userId }
            });

            if (existingRestaurant) {
              console.log(`✅ Restaurant already exists for ${userId}, skipping creation`);
            } else {
              await prisma.restaurant.create({
                data: {
                  name: restaurantDetails.restaurantName || 'New Restaurant',
                  parentCompany: 'Single',
                  ownerName: user.name || 'Owner',
                  category: restaurantDetails.category || 'Other',
                  ownerId: userId,
                  menu: {
                    create: {
                      name: "Standard Menü",
                      description: "Default Menü",
                      bgColor: "#ffffff",
                      font: "Inter"
                    }
                  },
                  locations: {
                    create: {
                      street: restaurantDetails.street,
                      houseNumber: restaurantDetails.houseNumber,
                      city: restaurantDetails.city,
                      postalCode: restaurantDetails.postalCode,
                      country: restaurantDetails.country || "DE"
                    }
                  }
                }
              });
              console.log(`✅ New restaurant created for ${userId}`);
            }
          }
        }
        break;
      }

      case "invoice.paid":
        console.log(`Subscription renewed: ${event.data.object.subscription}`);
        break;

      case "invoice.payment_failed":
        console.log(`Payment failed: ${event.data.object.subscription}`);
        break;

      default:
        console.log(`Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
