"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  const handleCheckout = async (tier) => {
    const res = await fetch("/api/payment/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Wähle deinen Tarif</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <Card className="border-2 border-gray-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfekt zum Starten</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-4">€0</div>
              <ul className="text-left space-y-2 mb-8">
                <li>✓ 1 Restaurant</li>
                <li>✓ Basis Features</li>
                <li>✓ 50 Gerichte Limit</li>
                <li>✗ Keine Premium Farben</li>
              </ul>
              <Button variant="outline" asChild className="w-full" onClick={() => router.push("/ErstelleRestaurantAccount/FreeTier")}>
                Jetzt starten
              </Button>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Empfohlen</div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>Unbegrenzte Möglichkeiten</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">€19<small className="text-lg">/Monat</small></div>
              <ul className="text-left space-y-2 mb-8">
                <li>✓ Unbegrenzte Gerichte</li>
                <li>✓ Premium Farben</li>
                <li>✓ Mehreren Standorte</li>
                <li>✓ Priorisierter Support</li>
              </ul>
              <Button onClick={() => handleCheckout("pro")} size="lg" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                Jetzt Pro abonnieren
              </Button>
            </CardContent>
          </Card>
        </div>

        {session && (
          <div className="mt-16 text-center">
            <p>Aktueller Tarif: <span className="font-semibold">{session.user.subscription}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
