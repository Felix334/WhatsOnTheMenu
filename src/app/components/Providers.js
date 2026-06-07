"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={true}>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
