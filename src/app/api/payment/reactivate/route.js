import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: token.id },
    select: { stripeSubscriptionId: true },
  });

  if (!user?.stripeSubscriptionId) {
    return NextResponse.json({ error: "Kein aktives Abonnement" }, { status: 404 });
  }

  try {
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await prisma.user.update({
      where: { id: token.id },
      data: { subscriptionStatus: "active" },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Reaktivierung fehlgeschlagen" }, { status: 500 });
  }
}
