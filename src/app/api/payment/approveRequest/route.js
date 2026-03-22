
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { stripeID, userID } = body;
  
  if (userID !== session.user.id) {
    return new Response("User mismatch", { status: 403 });
  }

  try {
    // Verify Stripe session
    const stripeSession = await stripe.checkout.sessions.retrieve(stripeID);
    if (stripeSession.payment_status !== 'paid') {
      return new Response("Payment not completed", { status: 400 });
    }

    const tier = stripeSession.metadata.tier || 'Pro';
    const subscriptionId = stripeSession.subscription;

    // Get restaurant queue for user
    const queueEntry = await prisma.restaurantQueue.findFirst({
      where: { ownerId: userID, status: 'pending' },
    });

    if (!queueEntry) {
      return new Response("No pending restaurant request", { status: 404 });
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;

    // Update user profile
    await prisma.user.update({
      where: { id: userID },
      data: {
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        subscriptionStatus: "active",
        subscription: tier,
        role: "Owner",
      },
    });

    // Create restaurant from queue data
    await prisma.restaurant.create({
      data: {
        name: queueEntry.restaurantName,
        parentCompany: 'Single',
        ownerName: queueEntry.name,
        category: queueEntry.category,
        description: queueEntry.description,
        email: queueEntry.email,
        phoneNumber: queueEntry.phoneNumber,
        status: "active",
        owner: { connect: { id: userID } },
        locations: {
          create: {
            street: queueEntry.street,
            houseNumber: queueEntry.houseNumber,
            postalCode: queueEntry.postalCode,
            city: queueEntry.city,
            country: queueEntry.country,
          },
        },
        menu: {
          create: {
            name: "Standard Menu",
            description: "Willkommen Menü",
            bgColor: "#ffffff",
            font: "Inter",
          },
        },
      },
    });

    // Delete queue entry (approved)
    await prisma.restaurantQueue.delete({
      where: { id: queueEntry.id },
    });

    return Response.json({ success: true, message: "Restaurant created" });
  } catch (error) {
    console.error("Approve request error:", error);
    return new Response("Internal error", { status: 500 });
  }
}

