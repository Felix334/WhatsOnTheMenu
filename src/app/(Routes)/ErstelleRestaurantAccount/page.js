"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    id: "free",
    name: "Free",
    label: "Kostenlos",
    price: "€0",
    period: "/Monat",
    description: "Perfekt zum Ausprobieren",
    features: ["Bis zu 7 Kategorien", "Digitale Speisekarte", "30 Gerichte Limit", "QR-Code Generator"],
    href: "/ErstelleRestaurantAccount/FreeTier",
    cta: "Kostenlos starten",
    isActive: (sub) => !sub || sub === "FreeTier",
    color: "gray",
    status: false,
  },
  {
    id: "Professional",
    name: "Professional",
    label: "Beliebteste Wahl",
    price: "",
    period: "/Monat",
    description: "Unbegrenzte Möglichkeiten",
    features: ["Bis zu 25 Kategorien", "Bis zu 200 Gerichte", "QR-Code", "Premium Farben & Fonts", "Management-System", "Gerichtverfügbarkeitsanzeige, Event-Kalender, Eigene Subdomain"],
    href: "/ErstelleRestaurantAccount/Professional",
    cta: "Pro abonnieren",
    featured: true,
    isActive: (sub) => sub === "Professional",
    color: "amber",
    status: true,
  },
  {
    id: "Business",
    name: "Business",
    label: "Business",
    price: "€7.99",
    period: "/Monat",
    description: "Maximale Features & Support",
    features: ["Bis zu 15 Kategorien", "Bis zu 100 Gerichte", "Basis Templates", "QR-Code"],
    href: "/ErstelleRestaurantAccount/Business",
    cta: "Business abonnieren",
    isActive: (sub) => sub === "Business",
    color: "orange",
    status: true,
  },
];

function CheckIcon({ color }) {
  const bg = color === "amber" || color === "orange" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500";
  return <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${bg}`}>✓</span>;
}

function PricingContent() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const { data: session } = useSession();
  const sub = session?.user?.subscription;

  return (
    <section className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-red-700 uppercase tracking-widest text-xs font-semibold mb-3">Tarife</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Wähle deinen Tarif</h1>
          <p className="text-gray-500 max-w-md mx-auto">Starte kostenlos und wechsle jederzeit. Keine versteckten Kosten.</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {TIERS.map((tier) => {
            const active = tier.isActive(sub);
            const status = tier.status;
            return (
              <Card key={tier.id} className={`flex flex-col transition-all duration-300 ${tier.featured ? "border-2 border-red-800 bg-white shadow-xl scale-105 relative" : "border border-gray-200 bg-white hover:shadow-lg"}`}>
                {tier.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-800 text-white px-5 py-1 rounded-full text-xs font-bold tracking-wide shadow">⭐ Empfohlen</div>}

                <CardHeader className={`pb-2 ${tier.featured ? "pt-7" : ""}`}>
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${tier.color === "amber" ? "text-red-700" : tier.color === "orange" ? "text-gray-500" : "text-gray-400"}`}>{tier.label}</p>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col flex-1">
                  <div className="mb-6">
                    <span className={`text-5xl font-bold ${tier.color === "amber" ? "text-red-800" : "text-gray-900"}`}>{tier.price}</span>
                    <span className="text-gray-400 ml-1">{tier.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm text-gray-600 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckIcon color={tier.color} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {status ? null : (
                    <div className="mt-auto">
                      {active ? (
                        <Button disabled className="w-full">
                          Aktiver Plan
                        </Button>
                      ) : (
                        <Button asChild className={tier.featured ? "w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold shadow" : "w-full border-gray-300 hover:border-red-400 hover:text-red-700"} variant={tier.featured ? undefined : "outline"}>
                          <Link href={`${tier.href}${queryString ? `?${queryString}` : ""}`}>{tier.cta}</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {session && sub && (
          <div className="mt-16 text-center">
            <p className="text-gray-500">
              Aktueller Tarif: <span className="font-semibold text-gray-900">{sub}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Page() {
  const { status, data: session } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Lade...</div>;
  }

  if (!session?.user?.id) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Bitte anmelden</div>;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Lade...</div>}>
      <PricingContent />
    </Suspense>
  );
}
