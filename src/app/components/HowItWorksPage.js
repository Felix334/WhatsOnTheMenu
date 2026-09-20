import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicLinkButton } from "@/app/components/DynamicLink";
import { localizedPath } from "@/i18n/config";
import PublicHeader from "./PublicHeader";

// Geteiltes Markup der "Wie funktioniert's"-Seite. Der Inhalt kommt komplett
// aus dem Woerterbuch (t = <sprache>.howItWorks), damit jede Sprache dieselbe
// Seite bekommt, ohne das Layout zu duplizieren.
//
// Hinweis: /ErstelleRestaurantAccount/... bleibt bewusst unlokalisiert — die
// Registrierungsstrecke ist noch nicht uebersetzt und liegt weiterhin nur auf
// Deutsch vor.

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <p className="text-red-700 uppercase tracking-widest text-xs font-semibold mb-3">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">{title}</h2>
      {subtitle && <p className="text-gray-500">{subtitle}</p>}
    </div>
  );
}

export default function HowItWorksPage({ dict, locale }) {
  const t = dict.howItWorks;
  const pricingHref = localizedPath("/pricing", locale);
  const signupHref = localizedPath("/ErstelleRestaurantAccount/FreeTier", locale);

  return (
    <>
      <PublicHeader t={dict} locale={locale} />
      <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="bg-linear-to-br from-red-900 to-gray-950 px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-5">{t.hero.badge}</Badge>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-5 leading-tight">
            {t.hero.titleLine1}
            <br className="hidden sm:block" /> {t.hero.titleLine2}
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <DynamicLinkButton size="lg" href={signupHref} className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold shadow-lg">
              {t.hero.ctaPrimary}
            </DynamicLinkButton>
            <DynamicLinkButton size="lg" variant="outline" href={pricingHref} className="border-white/50 text-white hover:bg-white/10">
              {t.hero.ctaSecondary}
            </DynamicLinkButton>
          </div>
        </div>
      </section>

      {/* ─── Schritte für Restaurants ─────────────────────────── */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <SectionHeading eyebrow={t.steps.eyebrow} title={t.steps.title} subtitle={t.steps.subtitle} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.steps.items.map((step) => (
            <Card key={step.number} className="relative border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-800 text-white font-bold text-lg mb-4 shadow">{step.number}</div>
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
          <SectionHeading eyebrow={t.features.eyebrow} title={t.features.title} subtitle={t.features.subtitle} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map((f) => (
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

      {/* ─── Für Ihre Gäste ──────────────────────────────────── */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <SectionHeading eyebrow={t.guests.eyebrow} title={t.guests.title} subtitle={t.guests.subtitle} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.guests.items.map((g) => (
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
          <SectionHeading eyebrow={t.plans.eyebrow} title={t.plans.title} subtitle={t.plans.subtitle} />
          <DynamicLinkButton size="lg" href={pricingHref} className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold shadow">
            {t.plans.cta}
          </DynamicLinkButton>
        </div>
      </section>

      {/* ─── Abschluss-CTA ────────────────────────────────────── */}
      <section className="bg-red-800 px-4 py-20">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">{t.cta.title}</h2>
          <p className="text-red-100 mb-8 text-lg">{t.cta.subtitle}</p>
          <DynamicLinkButton size="lg" href={signupHref} className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold shadow-lg">
            {t.cta.button}
          </DynamicLinkButton>
        </div>
      </section>
      </main>
    </>
  );
}
