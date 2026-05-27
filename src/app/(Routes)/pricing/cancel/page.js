"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

function CancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-20">
      <div className="max-w-md mx-auto px-4">
        <Card className="shadow-xl border-amber-200">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-serif font-bold text-gray-900 mb-3">Abgebrochen</CardTitle>
            <p className="text-gray-500 mb-8">
              {cancelled
                ? "Die Zahlung wurde abgebrochen. Dein Abonnement wurde nicht aktiviert."
                : "Etwas ist schiefgelaufen. Versuche es erneut."}
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push("/pricing")} size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                Erneut versuchen
              </Button>
              <Button variant="outline" onClick={() => router.push("/ErstelleRestaurantAccount/FreeTier")} className="w-full border-amber-300 text-amber-700 hover:bg-amber-50">
                Kostenlos starten
              </Button>
              <Button variant="link" onClick={() => router.push("/Profil")} className="text-gray-400">
                Zum Profil
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Lädt...</div>}>
      <CancelContent />
    </Suspense>
  );
}
