import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeSubscriptionId: true, subscription: true, subscriptionStatus: true },
  });

  if (!user?.stripeSubscriptionId) {
    return NextResponse.json({ subscription: null });
  }

  try {
    const sub = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    return NextResponse.json({
      subscription: {
        status: sub.status,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        currentPeriodEnd: sub.current_period_end,
        tier: user.subscription,
      },
    });
  } catch {
    return NextResponse.json({ error: "Stripe-Daten konnten nicht geladen werden" }, { status: 500 });
  }
}
