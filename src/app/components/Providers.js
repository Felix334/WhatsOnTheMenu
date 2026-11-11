"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import PastDueBanner from "./PastDueBanner";
import StaffInvitationDialog from "./StaffInvitationDialog";
import { subdomainFromHostname } from "@/lib/schemas/subdomain";

// Speisekarten für Gäste: kein SessionProvider, also keine /api/auth/session-
// Abfrage pro Besuch (jeder Aufruf ist eine Serverless-Invocation).
// "/sub" ist der interne Pfad der Subdomain-Speisekarten — so sieht ihn der
// Server beim Vorrendern.
const PUBLIC_GUEST_PREFIXES = ["/UnserePartner", "/sub/"];

// Im Browser zeigt usePathname() auf einer Restaurant-Subdomain nur "/" (die
// Middleware schreibt intern auf /sub/<name> um). Deshalb dort zusätzlich am
// Hostnamen erkennen — sonst würde jeder Gast doch wieder die Session abfragen.
function isRestaurantSubdomain() {
  return typeof window !== "undefined" && subdomainFromHostname(window.location.hostname) !== null;
}

export default function Providers({ children }) {
  const pathname = usePathname();
  const isPublicGuestRoute = PUBLIC_GUEST_PREFIXES.some((prefix) => pathname?.startsWith(prefix)) || isRestaurantSubdomain();

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
