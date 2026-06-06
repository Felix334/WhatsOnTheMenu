import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function DELETE(request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  const isSelf = session.user.id === id;
  const isAdmin = session.user.role === "Admin";

  if (!isSelf && !isAdmin) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Stripe cleanup — wrapped separately so a Stripe error doesn't block DB deletion
    if (user.stripeCustomerId) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: "active",
        });
        for (const sub of subscriptions.data) {
          await stripe.subscriptions.cancel(sub.id);
        }
        await stripe.customers.del(user.stripeCustomerId);
      } catch (stripeErr) {
        // Log but continue — customer may already be deleted on Stripe side
        console.error("Stripe cleanup error (continuing with DB delete):", stripeErr);
      }
    }

    // DB löschen — cascade entfernt Restaurant, Menü, Bestellungen usw.
    await prisma.user.delete({ where: { id } });

    // DSGVO-Audit-Log (bleibt auch in production)
    console.info(
      `Account deleted | id: ${id} | by: ${session.user.id} | timestamp: ${new Date().toISOString()}`
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
