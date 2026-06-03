"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuccessPage({ searchParams }) {
  const router = useRouter();
  const { update } = useSession();
  const sessionId = searchParams?.session_id;
  const refreshed = useRef(false);

  useEffect(() => {
    if (!sessionId || refreshed.current) return;
    refreshed.current = true;

    // Webhook braucht ~1-2s — danach Session refreshen damit role/subscription stimmt
    const timer = setTimeout(() => update(), 2000);
    return () => clearTimeout(timer);
  }, [sessionId, update]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-20">
      <div className="max-w-md mx-auto px-4">
        <Card className="shadow-xl border-amber-200">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Zahlung erfolgreich!</h1>
            <p className="mt-3 text-gray-500">Dein Abonnement ist jetzt aktiv. Dein Restaurant wird automatisch eingerichtet.</p>
            <Button
              className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => router.push("/settings")}
            >
              Zum Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
