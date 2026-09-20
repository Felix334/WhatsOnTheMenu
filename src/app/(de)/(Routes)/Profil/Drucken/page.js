"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DynamicLink } from "@/app/components/DynamicLink";

import { useRestaurantData, markUserAnsichtNavigation } from "../components/fetchData";
import { formatPrice } from "@/lib/priceRules";

// Druckbare Version der Speisekarte — dieselben Daten wie der Editor, in ein
// A4-Layout gegossen. Kein PDF-Generator nötig: der Druckdialog des Browsers
// kann "Als PDF speichern", das erspart eine zusätzliche Abhängigkeit.
//
// Hinweis: Die Abo-Prüfung hier ist reine UI-Führung. Die Seite rendert
// ausschließlich Daten, die dem Besitzer ohnehin gehören und die er im Editor
// sieht — es gibt also nichts serverseitig zu schützen.
const PAID_TIERS = ["Professional", "Business"];

const PRINT_CSS = `
@page { size: A4 portrait; margin: 16mm 14mm; }
@media print {
  .no-print { display: none !important; }
  body { background: #fff !important; }
  .print-sheet { box-shadow: none !important; margin: 0 !important; padding: 0 !important; max-width: none !important; }
  .print-group { break-inside: auto; }
  .print-category { break-inside: avoid; }
  .print-dish { break-inside: avoid; }
}
`;

export default function DruckenPage() {
  const { data: session, status } = useSession();
  const [userID, setUserID] = useState("");
  const { serverData, isLoading, font, headingFont } = useRestaurantData(userID);

  const [showDescriptions, setShowDescriptions] = useState(true);
  const [showAllergens, setShowAllergens] = useState(true);
  const [leaderDots, setLeaderDots] = useState(true);
  const [columns, setColumns] = useState("1");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "Owner") {
      setUserID(session.user.id);
    }
  }, [status, session]);

  if (status === "loading" || (isLoading && !serverData)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (status === "authenticated" && !PAID_TIERS.includes(session?.user?.subscription)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-5xl">🖨️</p>
        <h1 className="text-2xl font-semibold text-gray-900">Druckansicht ist ein Premium-Feature</h1>
        <p className="text-gray-500 max-w-md">Erstelle aus deiner digitalen Karte mit einem Klick eine gedruckte Speisekarte — immer auf demselben Stand wie der QR-Code.</p>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/Profil">Zurück zum Editor</Link>
          </Button>
          <DynamicLink href="/pricing" className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">
            Tarife ansehen
          </DynamicLink>
        </div>
      </div>
    );
  }

  const restaurant = serverData?.userData?.restaurant;
  const menu = restaurant?.menu?.[0];
  const categoryGroups = menu?.categoryGroup ?? [];
  const location = restaurant?.locations?.[0];

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{PRINT_CSS}</style>

      {/* Steuerleiste — wird nicht mitgedruckt */}
      <header className="no-print sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2 flex flex-wrap items-center gap-3">
          <Button asChild variant="ghost" size="sm" onClick={markUserAnsichtNavigation}>
            <Link href="/Profil">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Link>
          </Button>

          <span className="text-sm font-semibold text-gray-900">Druckansicht</span>

          <div className="flex items-center gap-4 ml-auto flex-wrap">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={showDescriptions} onCheckedChange={(v) => setShowDescriptions(!!v)} />
              Beschreibungen
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={showAllergens} onCheckedChange={(v) => setShowAllergens(!!v)} />
              Allergene
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={leaderDots} onCheckedChange={(v) => setLeaderDots(!!v)} />
              Führungspunkte
            </label>

            <div className="flex items-center gap-2">
              <Label htmlFor="print-columns" className="text-sm">
                Spalten
              </Label>
              <Select value={columns} onValueChange={setColumns}>
                <SelectTrigger id="print-columns" className="w-20" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-4" />
              Drucken / als PDF speichern
            </Button>
          </div>
        </div>
      </header>

      <main className="print-sheet max-w-3xl mx-auto my-8 bg-white shadow-lg px-10 py-12" style={{ fontFamily: font || undefined }}>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-wide" style={{ fontFamily: headingFont || font || undefined }}>
            {restaurant?.name ?? "Speisekarte"}
          </h1>
          {restaurant?.description && <p className="mt-2 text-gray-500">{restaurant.description}</p>}
          {location && (
            <p className="mt-2 text-xs text-gray-400">
              {location.street} {location.houseNumber}, {location.postalCode} {location.city}
            </p>
          )}
        </div>

        {categoryGroups.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Keine Kategorien vorhanden.</p>
        ) : (
          <div className="space-y-10">
            {categoryGroups.map((group) => (
              <section key={group.id} className="print-group">
                <h2 className="text-2xl font-semibold border-b pb-2 mb-5" style={{ fontFamily: headingFont || font || undefined }}>
                  {group.name}
                </h2>

                <div className={`space-y-6 ${columns === "2" ? "sm:columns-2 sm:gap-8 sm:space-y-0" : ""}`}>
                  {(group.categories ?? []).map((category) => (
                    <div key={category.id} className={`print-category ${columns === "2" ? "break-inside-avoid mb-6" : ""}`}>
                      <h3 className="text-lg font-semibold uppercase tracking-wider text-gray-700 mb-2">{category.name}</h3>
                      {category.description && <p className="text-xs text-gray-400 mb-2">{category.description}</p>}

                      <ul className="space-y-1.5">
                        {(category.dishes ?? []).map((dish) => (
                          <li key={dish.id} className="print-dish">
                            <div className="flex items-baseline gap-2">
                              <span className="font-medium">{dish.name}</span>
                              {leaderDots && <span aria-hidden className="flex-1 border-b border-dotted border-gray-300 translate-y-[-3px]" />}
                              <span className="font-mono whitespace-nowrap">{formatPrice(dish.price)}</span>
                            </div>
                            {showDescriptions && dish.description && <p className="text-sm text-gray-500 pr-16">{dish.description}</p>}
                            {showAllergens && dish.allergens?.length > 0 && <p className="text-[10px] text-gray-400">Allergene: {dish.allergens.join(", ")}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="mt-12 pt-4 border-t text-center text-[10px] text-gray-400">Allergenangaben ohne Gewähr — im Zweifel bitte beim Personal nachfragen.</p>
      </main>
    </div>
  );
}
