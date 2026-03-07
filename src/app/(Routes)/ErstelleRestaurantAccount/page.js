"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function PricingContent() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const { data: session } = useSession();

  const tier = session?.user?.subscription?.tier ?? "FREE";

  const isFree = tier === "FREE";
  const isPro = tier === "PRO";
  const isEnterprise = tier === "ENTERPRISE";

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Flexible Preise für jedes Restaurant
          </h1>
          <p className="text-lg text-gray-600">
            Starte kostenlos und skaliere, wenn dein Restaurant wächst.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          {/* =========================
              STARTER
          ========================== */}
          <Card className="flex flex-col rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-200">
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>Kostenloser Einstieg</CardDescription>
              <div className="text-4xl font-bold mt-4">
                0€
                <span className="text-base font-normal text-gray-500">
                  {" "}
                  /Monat
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-4 mb-10">
                {[
                  "1 Speisekarte",
                  "Basis Templates",
                  "QR-Code",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  asChild={isFree}
                  disabled={!isFree}
                  className="w-full"
                >
                  {isFree ? (
                    <Link
                      href={`/ErstelleRestaurantAccount/FreeTier?${queryString}`}
                    >
                      Kostenlos starten
                    </Link>
                  ) : (
                    <span>Aktiver Plan</span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* =========================
              PROFESSIONAL
          ========================== */}
          <Card className="relative flex flex-col rounded-2xl shadow-xl border-2 border-red-700 bg-red-800 text-white scale-105">
            <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 text-sm font-semibold shadow">
              Empfohlen
            </Badge>

            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription className="text-red-100">
                Für wachsende Restaurants
              </CardDescription>
              <div className="text-4xl font-bold mt-4">
                9.99€
                <span className="text-base font-normal text-red-200">
                  {" "}
                  /Monat
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-4 mb-10">
                {[
                  "Bis zu 15 Karten",
                  "Premium Templates",
                  "Mehrsprachige Menüs",
                  "QR-Code",
                  "Event-Planer",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  asChild={!isPro}
                  disabled={isPro}
                  className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold"
                >
                  {isPro ? (
                    <span>Aktiver Plan</span>
                  ) : (
                    <Link
                      href={`/ErstelleRestaurantAccount/Professional?${queryString}`}
                    >
                      Jetzt upgraden
                    </Link>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-200">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>Individuelle Lösung</CardDescription>
              <div className="text-4xl font-bold mt-4">
                Individuell
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-4 mb-10">
                {[
                  "Alles aus Professional",
                  "White-Label Lösung",
                  "API-Zugang",
                  "Erweiterte Analytics",
                  "Priority Support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  asChild={!isEnterprise}
                  disabled={isEnterprise}
                  variant="outline"
                  className="w-full"
                >
                  {isEnterprise ? (
                    <span>Aktiver Plan</span>
                  ) : (
                    <Link
                      href={`/ErstelleRestaurantAccount/Individuell?${queryString}`}
                    >
                      Vertrieb kontaktieren
                    </Link>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const { data: session, status } = useSession();

  /* -------------------------
     Loading & Auth Check
  -------------------------- */

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Lade...
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Bitte anmelden
      </div>
    );
  }

  /* -------------------------
     Role & Subscription Logic
  -------------------------- */

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Lade...
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
