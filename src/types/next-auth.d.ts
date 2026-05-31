import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      subscription: 'FreeTier' | 'Professional' | 'Individuell';
      staffMemberships: { restaurantId: string; role: string }[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    subscription: 'FreeTier' | 'Professional' | 'Individuell';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    staffMemberships?: { restaurantId: string; role: string }[];
  }
}