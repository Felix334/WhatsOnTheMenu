"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuccessClient({ searchParams }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const sessionId = searchParams?.session_id;
  const tier = session?.user?.subscription ?? "FreeTier";

  useEffect(() => {
    if (status === "loading") return; // nur Logging überspringen

    if (sessionId) {
      console.log("Stripe session ID:", sessionId);
    }

    console.log("SESSION:", session);
    console.log("TIER:", tier);
  }, [sessionId, session, tier, status]);

  // 🔹 Früher Return nur für UI
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verifiziere Zahlung...</div>
      </div>
    );
  }

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
            <p className="mt-3 text-gray-500">Dein Abonnement ist jetzt aktiv.</p>
            <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              Bitte einmal ab- und neu anmelden, um alle Features freizuschalten.
            </p>
            <Button className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white" onClick={() => router.push("/")}>
              Zum Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
