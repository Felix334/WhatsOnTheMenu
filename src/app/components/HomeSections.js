import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localizedPath } from "@/i18n/config";

// Zusatz-Abschnitte der Startseite (Schritte, Vorteile, FAQ).
// Texte kommen aus home.steps / home.benefits / home.faq im Woerterbuch.
//
// Bewusst ohne Hooks und ohne useSearchParams: alles landet als fertiges HTML
// im Prerender, damit Google den Text sieht (siehe CLAUDE.md, Suspense-Falle).

export function StepsSection({ t, locale }) {
  return (
    <section id="steps" className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{t.title}</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.items.map((step, i) => (
            <li key={step.title}>
              <Card className="h-full">
                <CardHeader>
                  <span aria-hidden className="w-10 h-10 rounded-full bg-red-800 text-white font-bold flex items-center justify-center mb-2">
                    {i + 1}
                  </span>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">{step.description}</CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <p className="text-center mt-10">
          <Link href={localizedPath("/WieFunktionierts", locale)} className="text-red-800 font-medium underline underline-offset-4 hover:text-red-900">
            {t.more}
          </Link>
        </p>
      </div>
    </section>
  );
}

export function BenefitsSection({ t }) {
  return (
    <section id="benefits" className="py-16 sm:py-20 bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{t.title}</h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {t.items.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
              <span aria-hidden className="text-3xl shrink-0">
                {item.icon}
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ t }) {
  // FAQPage-Daten fuer Google (moegliche Rich Results). Inhalt kommt nur aus
  // dem eigenen Woerterbuch; "<" trotzdem escapen, damit kein Text das
  // <script>-Tag schliessen kann.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }).replace(/</g, "\\u003c");

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{t.title}</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">{t.subtitle}</p>
        </div>

        {/* <details> statt JS-Akkordeon: die Antworten stehen immer im HTML */}
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {t.items.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden className="text-red-800 text-xl transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
