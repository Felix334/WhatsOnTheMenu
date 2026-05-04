import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function DELETE(request, { params }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  const isSelf = session.user.id === id;
  const isAdmin = session.user.role === "admin";

  if (!isSelf && !isAdmin) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
      });

      for (const sub of subscriptions.data) {
        await stripe.subscriptions.cancel(sub.id);
      }

      // Customer komplett löschen (entfernt auch Zahlungsmethoden)
      await stripe.customers.del(user.stripeCustomerId);
    }

    // 2. Account in DB löschen
    await prisma.user.delete({ where: { id } });

    // 3. DSGVO-Logging
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