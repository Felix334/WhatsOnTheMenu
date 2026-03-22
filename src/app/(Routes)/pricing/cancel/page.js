"use client";
export const dynamic = "force-dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card"; // Removed unused CardContent, CardHeader, CardDescription

export default function CancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cancelled = searchParams.get("cancelled");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-20">
      <div className="max-w-md mx-auto px-4">
        <Card className="shadow-xl border-orange-200">
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Abgesagt</CardTitle>
            <p className="text-lg text-gray-600 mb-8">{cancelled ? "Die Zahlung wurde abgebrochen. Dein Abonnement wurde nicht aktiviert." : "Etwas ist schiefgelaufen. Versuche es erneut."}</p>
            <div className="space-y-3">
              <Button onClick={() => router.push("/(Routes)/pricing")} size="lg" className="w-full">
                Erneut versuchen
              </Button>
              <Button variant="outline" onClick={() => router.push("/(Routes)/ErstelleRestaurantAccount/FreeTier")} className="w-full">
                Free Tier wählen
              </Button>
              <Button variant="link" onClick={() => router.push("/(Routes)/Profil")}>
                Zum Profil
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
