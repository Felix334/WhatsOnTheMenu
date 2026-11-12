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
import { GOOGLE_FONTS_URL } from "../components/fontList";
import { bgColorClass, bgColorStyle } from "../components/ColorPicker";
import { AllergenBadges } from "../components/menuSection";
import { DENSITY_CLASS, RADIUS_CLASS, heroClass, heroStyle } from "../components/menuStyle";
import { ALLERGENS } from "@/lib/allergens";

// Druckbare Version der Speisekarte — dieselben Daten UND dieselbe Gestaltung
// wie der Editor (Kopfbereich, Farben, Schriften, Rundungen, Ausrichtung,
// Führungspunkte je Kategorie), nur ohne Bearbeitungs-Knöpfe. Die
// Stil-Konstanten kommen aus components/menuStyle.js, damit Editor und Druck
// nicht auseinanderlaufen. Kein PDF-Generator nötig: der Druckdialog des
// Browsers kann "Als PDF speichern".
//
// Hinweis: Die Abo-Prüfung hier ist reine UI-Führung. Die Seite rendert
// ausschließlich Daten, die dem Besitzer ohnehin gehören und die er im Editor
// sieht — es gibt also nichts serverseitig zu schützen.
const PAID_TIERS = ["Professional", "Business"];

// print-color-adjust: ohne das lassen Browser beim Drucken alle
// Hintergrundfarben weg, und die Karte sähe wieder anders aus als im Editor.
const PRINT_CSS = `
@page { size: A4 portrait; margin: 10mm; }
.print-sheet, .print-sheet * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
@media print {
  .no-print { display: none !important; }
  body { background: #fff !important; }
  .print-sheet { box-shadow: none !important; margin: 0 !important; max-width: none !important; }
  .print-category { break-inside: avoid; }
  .print-dish { break-inside: avoid; }
}
`;

export default function DruckenPage() {
  const { data: session, status } = useSession();
  const [userID, setUserID] = useState("");
  const { serverData, isLoading, bgColor, fontColor, font, headingFont, density } = useRestaurantData(userID);

  const [showDescriptions, setShowDescriptions] = useState(true);
  const [showAllergens, setShowAllergens] = useState(true);
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
        <h1 className="text-2xl font-semibold text-gray-900">Druckansicht gibt es ab dem Plus-Tarif</h1>
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
  const heroColor = menu?.heroColor || null;
  const heroTextColor = menu?.heroTextColor || "#ffffff";

  // Legende nur für Allergene, die auf dieser Karte tatsächlich vorkommen.
  const usedAllergenKeys = new Set(categoryGroups.flatMap((g) => (g.categories ?? []).flatMap((c) => (c.dishes ?? []).flatMap((d) => d.allergens ?? []))));
  const allergenLegend = ALLERGENS.filter((a) => usedAllergenKeys.has(a.key));

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{PRINT_CSS}</style>
      <link href={GOOGLE_FONTS_URL} rel="stylesheet" />

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

      <div className="print-sheet max-w-4xl mx-auto my-8 shadow-lg overflow-hidden" style={{ fontFamily: font || undefined }}>
        {/* Kopfbereich — wie im Editor */}
        <div className={`w-full ${heroClass(heroColor)} text-white py-10 px-4 text-center`} style={heroStyle(heroColor)}>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-wide drop-shadow" style={{ color: heroTextColor }}>
            {restaurant?.name || "Restaurant"}
          </h1>
          {menu?.description && (
            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: heroTextColor, opacity: 0.85 }}>
              {menu.description}
            </p>
          )}
          {location && (
            <p className="mt-2 text-xs" style={{ color: heroTextColor, opacity: 0.7 }}>
              {location.street} {location.houseNumber}, {location.postalCode} {location.city}
            </p>
          )}
        </div>

        {/* Karte — Hintergrund und Schriftfarbe wie im Editor */}
        <div className={`font-sans ${!bgColor ? "bg-amber-50" : ""} ${!fontColor ? "text-gray-900" : ""}`} style={{ ...(bgColor ? { backgroundColor: bgColor } : {}), ...(fontColor ? { color: fontColor } : {}) }}>
          <main className="px-4 sm:px-6 py-8 space-y-8">
            {categoryGroups.length === 0 ? (
              <p className="text-center text-gray-400 py-10">Keine Kategorien vorhanden.</p>
            ) : (
              categoryGroups.map((group) => (
                <section key={group.id} className={`${RADIUS_CLASS[group.borderRadius] ?? "rounded-2xl"} shadow-sm p-4 sm:p-6 border border-amber-100 ${bgColorClass(group.color) || "bg-white"}`} style={bgColorStyle(group.color)}>
                  <h2
                    className="text-2xl font-semibold mb-6 border-b pb-4 break-words"
                    style={{
                      ...(group.fontColor ? { color: group.fontColor } : {}),
                      textAlign: group.titleAlign ?? "left",
                      ...(headingFont ? { fontFamily: headingFont } : {}),
                    }}
                  >
                    {group.name}
                  </h2>

                  <div className={columns === "2" ? "sm:columns-2 sm:gap-6" : "space-y-8"}>
                    {(group.categories ?? []).map((category) => (
                      <PrintCategory key={category.id} category={category} density={density} font={font} headingFont={headingFont} showDescriptions={showDescriptions} showAllergens={showAllergens} twoColumns={columns === "2"} />
                    ))}
                  </div>
                </section>
              ))
            )}

            {showAllergens && allergenLegend.length > 0 && (
              <div className="text-xs opacity-70 pt-2">
                <p className="font-semibold mb-1">Allergene</p>
                <p>{allergenLegend.map((a) => `${a.id} = ${a.name}`).join(" · ")}</p>
              </div>
            )}
            <p className="pt-4 border-t text-center text-[10px] opacity-60">Allergenangaben ohne Gewähr — im Zweifel bitte beim Personal nachfragen.</p>
          </main>
        </div>
      </div>
    </div>
  );
}

// Eine Kategorie wie MenuSection im Editor, ohne Aktionsspalte und Knöpfe.
function PrintCategory({ category, density, font, headingFont, showDescriptions, showAllergens, twoColumns }) {
  const fontStyle = category.fontColor ? { color: category.fontColor } : {};
  const elevated = category.elevated ?? true;

  return (
    <div className={`print-category ${twoColumns ? "break-inside-avoid mb-6" : ""} ${RADIUS_CLASS[category.borderRadius] ?? "rounded-xl"} ${elevated ? "shadow-lg" : "border border-gray-200"} ${DENSITY_CLASS[density] ?? ""} w-full overflow-hidden ${bgColorClass(category.bgColor)}`} style={bgColorStyle(category.bgColor)}>
      <div className="py-5 px-4 border-b">
        <h3 className={`w-full text-2xl sm:text-3xl font-semibold break-words ${category.titleUppercase ? "uppercase tracking-widest" : ""}`} style={{ ...fontStyle, textAlign: category.titleAlign || "center", ...(headingFont ? { fontFamily: headingFont } : {}) }}>
          {category.name}
        </h3>
      </div>

      <ul className="divide-y" style={{ fontFamily: font || undefined }}>
        {(category.dishes ?? []).map((dish) => (
          <li key={dish.id} className="print-dish px-4 py-3">
            <div className="flex items-start justify-between gap-3" style={fontStyle}>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif break-words">{dish.name}</span>
                  {category.leaderDots && <span aria-hidden className="flex-1 min-w-6 border-b border-dotted border-current opacity-40" />}
                </div>
                {showDescriptions && dish.description && (
                  <p className="text-sm text-gray-500 break-words" style={fontStyle}>
                    {dish.description}
                  </p>
                )}
                {showAllergens && <AllergenBadges allergens={dish.allergens} />}
              </div>
              <span className="shrink-0 font-mono">{Number(dish.price).toFixed(2)}€</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
