"use client";

/**
 * ExplainCards
 * --------------------------------
 * Responsive Feature Section für eine Landingpage
 * - Mobile First Design
 * - Anpassung an alle Bildschirmgrößen
 * - Dynamische Feature Cards
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Feature Liste
 * --------------------------------
 * Inhalte werden hier zentral definiert.
 * Neue Features können einfach ergänzt werden.
 */
const features = [
  {
    icon: "🎨",
    title: "Einfach gehaltene Editoren",
    description:
      "Mit unserem intuitiven Editor können Sie Speisekarten ohne technische Kenntnisse erstellen, bearbeiten und aktualisieren.",
  },
  {
    icon: "📱",
    title: "QR-Code Integration",
    description:
      "Automatische Generierung eines QR-Codes für Ihre digitale Speisekarte. Gäste scannen einfach den Code und sehen sofort Ihr Menü.",
  },
  {
    icon: "🌍",
    title: "Premium Features",
    description:
      "Erweiterte Funktionen für ein moderneres und interaktiveres Erlebnis für Ihre Gäste.",
  },
  {
    icon: "⚡",
    title: "Echtzeit Updates",
    description:
      "Ändern Sie Preise, Bilder oder Gerichte sofort - Aktualisieren in Echtzeit möglich",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description:
      "Analysieren Sie, welche Gerichte besonders beliebt sind und wie Gäste mit Ihrer digitalen Karte interagieren.",
  },
  {
    icon: "🎯",
    title: "Anpassbare Designs",
    description:
      "Professionelle Design-Vorlagen, die perfekt zu Ihrem Restaurant-Branding passen.",
  },
];

export default function ExplainCards() {
  return (
    <section
      id="features"
      className="py-16 sm:py-20 lg:py-24 bg-white"
    >
      {/* Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Titelbereich */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Alles was du brauchst
          </h2>

          <p className="mt-4 text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Von der Erstellung bis zur Veröffentlichung – alle Tools für
            professionelle digitale Speisekarten.
          </p>
        </div>

        {/* Responsive Grid */}
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
          sm:gap-8
        "
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="
                transition-all
                duration-300
                hover:shadow-xl
                hover:-translate-y-1
              "
            >
              <CardHeader>

                {/* Icon */}
                <div className="text-3xl sm:text-4xl mb-4">
                  {feature.icon}
                </div>

                {/* Titel */}
                <CardTitle className="text-lg sm:text-xl">
                  {feature.title}
                </CardTitle>

              </CardHeader>

              <CardContent>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}