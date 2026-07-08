"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import PastDueBanner from "./PastDueBanner";
import StaffInvitationDialog from "./StaffInvitationDialog";

// Öffentliche Gast-Routen (QR-Speisekarte): kein SessionProvider, damit anonyme
// Gäste keinen /api/auth/session-Request auslösen. Komponenten unter diesen
// Präfixen dürfen useSession nicht verwenden.
const PUBLIC_GUEST_PREFIXES = ["/UnserePartner"];

export default function Providers({ children }) {
  const pathname = usePathname();
  const isPublicGuestRoute = PUBLIC_GUEST_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (isPublicGuestRoute) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <PastDueBanner />
      {children}
      <StaffInvitationDialog />
      <Toaster />
    </SessionProvider>
  );
}
