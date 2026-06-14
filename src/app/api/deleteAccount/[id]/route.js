import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function DELETE(request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  const isSelf = token.id === id;
  const isAdmin = token.role === "Admin";

  if (!isSelf && !isAdmin) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.stripeCustomerId) {
      try {
        // Alle noch nicht gekündigten Abos beenden …
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: "all",
        });
        for (const sub of subscriptions.data) {
          if (sub.status !== "canceled") {
            await stripe.subscriptions.cancel(sub.id);
          }
        }
        // … und den Customer löschen (kündigt sicherheitshalber alles Übrige).
        await stripe.customers.del(user.stripeCustomerId);
      } catch (stripeErr) {
        // Existiert der Customer bei Stripe nicht (mehr)? Dann ist das Ziel – kein
        // aktives Abo – bereits erreicht (z. B. in einem früheren, teilweise
        // erfolgreichen Versuch). Dann weiterlöschen → macht Retries idempotent.
        const alreadyGone =
          stripeErr?.code === "resource_missing" || stripeErr?.statusCode === 404;

        if (!alreadyGone) {
          // Echter Stripe-Fehler: NICHT weiterlöschen – sonst bliebe evtl. ein
          // aktives Abo bestehen, während der Account schon weg ist (Billing-Risiko).
          console.error("Stripe cleanup failed, aborting account deletion:", stripeErr);
          return NextResponse.json(
            { error: "Abo konnte nicht gekündigt werden – Account wurde NICHT gelöscht. Bitte später erneut versuchen." },
            { status: 502 }
          );
        }

        console.warn(
          "Stripe customer already removed, continuing with account deletion:",
          user.stripeCustomerId
        );
      }
    }

    await prisma.user.delete({ where: { id } });

    console.info(
      `Account deleted | id: ${id} | by: ${token.id} | timestamp: ${new Date().toISOString()}`
    );

    return NextResponse.json(
      { message: "Account and subscription deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
