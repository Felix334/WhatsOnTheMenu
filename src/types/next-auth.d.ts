import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      subscription: 'FreeTier' | 'Professional' | 'Business' | 'Individuell';
      staffMemberships: { restaurantId: string; role: string }[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    subscription: 'FreeTier' | 'Professional' | 'Business' | 'Individuell';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    staffMemberships?: { restaurantId: string; role: string }[];
  }
}