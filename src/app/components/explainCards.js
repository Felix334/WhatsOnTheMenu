// Removed "use client" - now server component for static caching

/**
 * ExplainCards
 * --------------------------------
 * Responsive Feature Section für eine Landingpage
 * - Mobile First Design
 * - Anpassung an alle Bildschirmgrößen
 * - Dynamische Feature Cards
 *
 * Die Inhalte kommen inzwischen aus dem Woerterbuch (src/i18n/<sprache>.js,
 * Abschnitt home.features) statt aus einer Konstante in dieser Datei — sonst
 * gaebe es die Feature-Texte nur auf Deutsch.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExplainCards({ t }) {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white">
      {/* Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Titelbereich */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{t.title}</h2>

          <p className="mt-4 text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">{t.subtitle}</p>
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
          {t.items.map((feature, index) => (
            <Card
              key={index}
              className="
                transition-all
                duration-300
                hover:shadow-xl
                hover:-translate-y-1
                border-l-4 border-l-red-800
              "
            >
              <CardHeader>
                {/* Icon */}
                <div className="text-3xl sm:text-4xl mb-4">{feature.icon}</div>

                {/* Titel */}
                <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-sm sm:text-base text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
