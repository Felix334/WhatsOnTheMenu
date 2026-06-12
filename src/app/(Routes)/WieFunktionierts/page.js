import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicLinkButton } from "@/app/components/DynamicLink";

export const metadata = {
  title: "Wie funktioniert's? – Digitale Speisekarte per QR-Code | WhatIsOnMyMenu",
  description:
    "In wenigen Minuten zur digitalen Speisekarte: Restaurant anlegen, Menü gestalten, QR-Code drucken. Deine Gäste scannen und sehen Gerichte, Preise, Allergene und Verfügbarkeit – ganz ohne App.",
};

// ─── Schritte für Restaurants ──────────────────────────────────────────────
const STEPS = [
  {
    number: "1",
    title: "Kostenlos anmelden",
    text: "Melde dich in Sekunden mit deinem Google-Konto an – keine Kreditkarte nötig. Du startest direkt im Free-Tarif.",
    icon: "👤",
  },
  {
    number: "2",
    title: "Restaurant & Menü anlegen",
    text: "Trage die Eckdaten deines Restaurants ein und baue deine Speisekarte: Kategorien, Gerichte, Preise, Beschreibungen und Allergene.",
    icon: "🍽️",
  },
  {
    number: "3",
    title: "Design anpassen",
    text: "Wähle Farben, Schriftarten und ein Hero-Design, das zu deinem Restaurant passt – deine digitale Karte sieht aus wie deine Marke.",
    icon: "🎨",
  },
  {
    number: "4",
    title: "QR-Code teilen",
    text: "Generiere deinen QR-Code, drucke ihn und platziere ihn auf den Tischen. Gäste scannen ihn und deine Karte öffnet sich sofort.",
    icon: "📲",
  },
];

// ─── Funktionen ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "📋",
    title: "Digitale Speisekarte",
    text: "Strukturiere dein Angebot in Gruppen, Kategorien und Gerichten – mit Preisen und Beschreibungen.",
  },
  {
    icon: "🔳",
    title: "QR-Code Generator",
    text: "Jedes Restaurant bekommt einen eigenen QR-Code. Einmal drucken, immer aktuell – Änderungen sind sofort live.",
  },
  {
    icon: "🎨",
    title: "Eigenes Design",
    text: "Hintergrundfarben, Schriftarten und Farbakzente pro Kategorie. Im Professional-Tarif zusätzlich Premium-Farben & -Fonts.",
  },
  {
    icon: "⚠️",
    title: "Allergene & Zutaten",
    text: "Hinterlege Allergene pro Gericht. Deine Gäste sehen auf einen Blick, was drin ist – rechtssicher und transparent.",
  },
  {
    icon: "🟢",
    title: "Echtzeit-Verfügbarkeit",
    text: "Markiere Gerichte mit einem Klick als „ausverkauft\". Gäste sehen sofort, was gerade verfügbar ist.",
  },
  {
    icon: "⭐",
    title: "Bewertungen",
    text: "Gäste können Gerichte bewerten. Durchschnittsbewertung und Anzahl werden direkt an der Speisekarte angezeigt.",
  },
  {
    icon: "👥",
    title: "Team-Verwaltung",
    text: "Lade Mitarbeiter ein und vergib Rollen (Manager, Service, Küche) mit passenden Berechtigungen – im Professional-Tarif.",
  },
  {
    icon: "🧾",
    title: "Tisch-Bestellungen",
    text: "Nimm Bestellungen pro Tisch auf und verwalte ihren Status von „offen\" über „bestätigt\" bis „erledigt\".",
  },
  {
    icon: "📍",
    title: "Mehrere Standorte",
    text: "Verwalte Adressen, Öffnungszeiten und Reservierungs-Kontakt – auch für Restaurants mit mehreren Filialen.",
  },
];

// ─── Vorteile für Gäste ────────────────────────────────────────────────────
const GUEST_POINTS = [
  {
    icon: "📷",
    title: "Einfach scannen",
    text: "QR-Code mit der Handykamera scannen – kein Download, keine App, kein Konto nötig.",
  },
  {
    icon: "🔎",
    title: "Alles auf einen Blick",
    text: "Gerichte, Preise, Beschreibungen und Allergene – übersichtlich und auf jedem Smartphone optimiert.",
  },
  {
    icon: "🥜",
    title: "Allergene sehen",
    text: "Mit einem Tippen erkennen, welche Allergene ein Gericht enthält – ideal für Gäste mit Unverträglichkeiten.",
  },
  {
    icon: "🆕",
    title: "Immer aktuell",
    text: "Preisänderungen oder ausverkaufte Gerichte erscheinen sofort – nie wieder eine veraltete Karte.",
  },
];

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">{title}</h2>
      {subtitle && <p className="text-gray-500">{subtitle}</p>}
    </div>
  );
}

export default function Page() {
  return (
    <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 mb-5">{"So funktioniert's"}</Badge>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-5 leading-tight">
            Deine digitale Speisekarte –<br className="hidden sm:block" /> in wenigen Minuten startklar
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Mit WhatIsOnMyMenu erstellst du eine digitale Speisekarte, die deine Gäste per QR-Code direkt am Tisch
            öffnen – ohne App, ohne Papier, jederzeit aktuell.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <DynamicLinkButton size="lg" href="/ErstelleRestaurantAccount/FreeTier" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow">
              Kostenlos starten
            </DynamicLinkButton>
            <DynamicLinkButton size="lg" variant="outline" href="/pricing" className="border-amber-300 text-amber-700 hover:bg-amber-50">
              Alle Tarife ansehen
            </DynamicLinkButton>
          </div>
        </div>
      </section>

      {/* ─── Schritte für Restaurants ─────────────────────────── */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Für Restaurants"
          title="In 4 Schritten zur eigenen Karte"
          subtitle="Vom Konto bis zum QR-Code auf dem Tisch – schneller, als du denkst."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <Card key={step.number} className="relative border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg mb-4 shadow">
                  {step.number}
                </div>
                <div className="text-2xl mb-2">{step.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Funktionen ───────────────────────────────────────── */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Funktionen"
            title="Alles, was deine Speisekarte braucht"
            subtitle="Von der Gestaltung über Allergene bis zur Team-Verwaltung – alles an einem Ort."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Für deine Gäste ──────────────────────────────────── */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Für deine Gäste"
          title="Scannen, sehen, genießen"
          subtitle="Deine Gäste brauchen nur ihr Smartphone – keine App, kein Konto."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GUEST_POINTS.map((g) => (
            <div key={g.title} className="text-center px-4">
              <div className="text-4xl mb-4">{g.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{g.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{g.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Tarife-Teaser ────────────────────────────────────── */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            eyebrow="Tarife"
            title="Starte kostenlos – wachse, wenn du bereit bist"
            subtitle="Im Free-Tarif baust du deine digitale Karte mit QR-Code völlig kostenlos. Mehr Kategorien, Gerichte und Funktionen schaltest du jederzeit mit einem Upgrade frei."
          />
          <DynamicLinkButton size="lg" href="/pricing" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow">
            Tarife vergleichen
          </DynamicLinkButton>
        </div>
      </section>

      {/* ─── Abschluss-CTA ────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 px-4 py-20">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Bereit für deine digitale Speisekarte?</h2>
          <p className="text-amber-50 mb-8 text-lg">
            Erstelle dein Restaurant kostenlos und teile deine Karte noch heute per QR-Code mit deinen Gästen.
          </p>
          <DynamicLinkButton size="lg" href="/ErstelleRestaurantAccount/FreeTier" className="bg-white text-amber-700 hover:bg-amber-50 font-semibold shadow-lg">
            Jetzt kostenlos starten
          </DynamicLinkButton>
        </div>
      </section>
    </main>
  );
}
