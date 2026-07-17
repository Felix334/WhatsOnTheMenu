import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe, webhookSecret, getSubscriptionTier } from "@/lib/stripe";
import { devLog, devWarn } from "@/lib/logger";
import { sendRegistrationConfirmation } from "@/lib/registrationMail";

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

  // Idempotenz: Stripe stellt Events bei Timeouts/Fehlern erneut zu. Jede Event-ID
  // wird vor der Verarbeitung in StripeEvent registriert — ein Unique-Konflikt
  // (P2002) bedeutet "schon verarbeitet" und wird direkt mit 200 quittiert.
  try {
    await prisma.stripeEvent.create({ data: { id: event.id, type: event.type } });
  } catch (err) {
    if (err?.code === "P2002") {
      devLog(`Duplicate Stripe event skipped: ${event.id}`);
      return NextResponse.json({ received: true });
    }
    console.error("StripeEvent registration failed:", err);
    return NextResponse.json({ error: "Event registration failed" }, { status: 500 });
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
          devWarn("Missing userId or subscriptionId in metadata");
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        const subscriptionTier = getSubscriptionTier(tier);

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            subscriptionStatus: "active",
            subscription: subscriptionTier,
            role: "Owner",
          },
          select: { name: true, email: true },
        });

        if (restaurantDetailsStr) {
          let restaurantDetails;
          try {
            restaurantDetails = JSON.parse(restaurantDetailsStr);
          } catch {
            console.error("Failed to parse restaurantDetails metadata");
            break;
          }

          // Bestätigungsmail nicht abwarten — der Webhook muss schnell mit 200 antworten.
          if (updatedUser?.email) {
            sendRegistrationConfirmation({
              to: updatedUser.email,
              restaurantName: restaurantDetails.restaurantName || "Dein Restaurant",
              tier: subscriptionTier,
            }).catch((err) => console.error("Registrierungs-Mail fehlgeschlagen:", err));
          }

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
            devLog(`Restaurant created for ${userId}`);
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
        devLog(`Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    // Registrierung zurücknehmen, damit der Stripe-Retry das Event erneut
    // verarbeiten kann statt es als Duplikat zu überspringen.
    await prisma.stripeEvent.delete({ where: { id: event.id } }).catch(() => {});
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
