import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      subscription: 'NoSubscription' | 'FreeTier' | 'Professional' | 'Business';
      subscriptionStatus?: string;
      staffMemberships: { restaurantId: string; role: string }[];
      restaurantId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    subscription: 'NoSubscription' | 'FreeTier' | 'Professional' | 'Business';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    staffMemberships?: { restaurantId: string; role: string }[];
    restaurantId?: string;
    subscriptionStatus?: string;
  }
}