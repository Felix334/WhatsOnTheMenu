import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from 'src/lib/prisma';
import { stripe } from 'src/lib/stripe';
import { Subscription } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
  },

  providers: [
    ...(process.env.EMAIL_SERVER_HOST
      ? [
          EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST,
              port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              },
            },
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),

    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
              params: { 
                prompt: 'select_account consent' 
              },
            },
          }),
        ]
      : []),

    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
      }
      if (user || trigger === 'update') {
        const userId = (user?.id ?? token.id) as string;

        const [freshUser, memberships] = await Promise.all([
          prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, subscription: true, subscriptionStatus: true, stripeSubscriptionId: true },
          }),
          prisma.restaurantStaff.findMany({
            where: { userId, approved: true },
            select: { restaurantId: true, role: true },
          }),
        ]);

        if (freshUser) {
          token.role = freshUser.role;
          token.subscription = freshUser.subscription;
          token.subscriptionStatus = freshUser.subscriptionStatus ?? undefined;

          // Sicherheitscheck: Owner mit bezahltem Plan → Stripe-Abo verifizieren (nur in Prod)
          if (process.env.NODE_ENV !== 'development' && freshUser.role === 'Owner' && freshUser.subscription !== 'FreeTier') {
            if (!freshUser.stripeSubscriptionId) {
              // Keine Stripe-ID in DB → definitiv kein Abo
              await prisma.user.update({
                where: { id: userId },
                data: { subscription: 'FreeTier', subscriptionStatus: 'canceled' },
              });
              token.subscription = 'FreeTier';
              token.subscriptionStatus = 'canceled';
            } else {
              try {
                const stripeSub = await stripe.subscriptions.retrieve(freshUser.stripeSubscriptionId);
                const isValid = ['active', 'trialing', 'past_due'].includes(stripeSub.status);
                if (!isValid) {
                  await prisma.user.update({
                    where: { id: userId },
                    data: { subscription: 'FreeTier', subscriptionStatus: 'canceled' },
                  });
                  token.subscription = 'FreeTier';
                  token.subscriptionStatus = 'canceled';
                }
              } catch (err) {
                console.error('Stripe-Verifikation beim Login fehlgeschlagen:', err);
              }
            }
          }
        }

        token.staffMemberships = memberships;

        const role = token.role as string;
        if (role === 'Owner') {
          const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: userId },
            select: { id: true },
          });
          token.restaurantId = restaurant?.id ?? undefined;
        } else if (memberships.length > 0) {
          token.restaurantId = memberships[0].restaurantId;

          // Staff bekommt die Subscription des Restaurant-Owners in die Session
          const restaurant = await prisma.restaurant.findUnique({
            where: { id: memberships[0].restaurantId },
            select: { ownerId: true },
          });
          if (restaurant?.ownerId) {
            const owner = await prisma.user.findUnique({
              where: { id: restaurant.ownerId },
              select: { subscription: true },
            });
            if (owner?.subscription) token.subscription = owner.subscription;
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.subscription = token.subscription as Subscription;
        session.user.subscriptionStatus = token.subscriptionStatus as string | undefined;
        session.user.staffMemberships = (token.staffMemberships ?? []) as any;
        session.user.restaurantId = token.restaurantId;
      }
      return session;
    },

    async signIn({ user }) {
      if (user?.email) {
        await prisma.restaurantStaff.updateMany({
          where: { email: user.email, userId: null },
          data: { userId: user.id },
        });
      }
      return true;
    },
  },

  // Es gibt keine eigene Login-Seite — der Login läuft über das Modal auf der
  // Homepage. Abbruch/Fehler beim OAuth-Flow landen daher auf "/" mit ?error=…
  // (wird dort per Toast angezeigt), statt auf der nicht existierenden /login.
  pages: {
    signIn: '/',
    error: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
