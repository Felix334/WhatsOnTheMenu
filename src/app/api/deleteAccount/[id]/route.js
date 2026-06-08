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
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: "active",
        });
        for (const sub of subscriptions.data) {
          await stripe.subscriptions.cancel(sub.id);
        }
        await stripe.customers.del(user.stripeCustomerId);
      } catch (stripeErr) {
        console.error("Stripe cleanup error (continuing with DB delete):", stripeErr);
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
