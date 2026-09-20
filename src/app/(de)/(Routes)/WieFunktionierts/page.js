import HowItWorksPage from "@/app/components/HowItWorksPage";
import { getDictionary, buildAlternates } from "@/i18n";

export const dynamic = "force-static";

export const metadata = {
  title: "Wie funktioniert's? – Digitale Speisekarte per QR-Code | WhatIsOnMyMenu",
  description: "In wenigen Minuten zur digitalen Speisekarte: Restaurant anlegen, Menü gestalten, QR-Code drucken. Ihre Gäste scannen und sehen Gerichte, Preise, Allergene und Verfügbarkeit – ganz ohne App.",
  alternates: buildAlternates("/WieFunktionierts", "de"),
};

export default function Page() {
  return <HowItWorksPage dict={getDictionary("de")} locale="de" />;
}
