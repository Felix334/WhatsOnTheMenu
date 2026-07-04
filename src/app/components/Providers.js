"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import PastDueBanner from "./PastDueBanner";
import StaffInvitationDialog from "./StaffInvitationDialog";

export default function Providers({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={true}>
      <PastDueBanner />
      {children}
      <StaffInvitationDialog />
      <Toaster />
    </SessionProvider>
  );
}
