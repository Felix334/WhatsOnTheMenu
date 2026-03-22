import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, getPriceId } from "@/lib/stripe";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  console.log("API checkout called");

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  console.log("Checkout data:", body);

  const { tier = "pro", restaurant } = body;

  const priceId = getPriceId(tier);

  if (!priceId) {
    console.error("Invalid tier:", tier);
    return new Response("Invalid tier", { status: 400 });
  }

  // ---------------------------
  // Stripe Customer holen / erstellen
  // ---------------------------
  let customerId = session.user.stripeCustomerId;

  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });

      console.log("Created customer:", customerId);
    } catch (err) {
      console.error("Customer creation failed:", err);
      return new Response("Customer error", { status: 500 });
    }
  }

  // ---------------------------
  // URLs
  // ---------------------------
  const baseUrl =
    process.env.NEXT_PUBLIC_URL || "https://whats-on-the-menu.vercel.app/";

  const successUrl =
    `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl =
    `${baseUrl}/pricing/cancel`;

  // ---------------------------
  // Checkout Session erstellen
  // ---------------------------
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: session.user.id,
        tier,
        restaurantDetails: JSON.stringify(restaurant || {}),
      },
    });

    console.log("Checkout session:", checkoutSession.id);

    return new Response(
      JSON.stringify({ url: checkoutSession.url }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Checkout creation failed:", err);
    return new Response("Checkout error", { status: 500 });
  }
}