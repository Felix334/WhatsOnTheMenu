// Impressum (/legal-notice Englisch, /de/Impressum Deutsch).
//
// Die Pflichtangaben (Name, Anschrift, E-Mail) stehen NUR hier in PROVIDER.
// Beide Sprachfassungen rendern dieselben Daten, damit sie sich nie
// widersprechen koennen — siehe Hinweis in AboutPage.js. Uebersetzt werden
// nur Ueberschriften und Erlaeuterungstexte (dict.imprint in de.js / en.js).
// Massgeblich ist die deutsche Fassung; die englische sagt das selbst.

const PROVIDER = {
  name: "Felix Mayer",
  street: "Mühlenblick 16",
  city: "74372 Sersheim",
  email: "support@whatisonmymenu.com",
};

// Bei inhaltlichen Aenderungen hier UND in src/app/sitemap.js nachziehen.
const LAST_UPDATED = "2026-11-11";

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100 wrap-anywhere hyphens-auto">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function ImprintPage({ dict, locale }) {
  const t = dict.imprint;
  const lastUpdated = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(LAST_UPDATED));

  return (
    <div className="min-h-screen bg-gray-50" lang={locale}>
      <div className="w-full bg-linear-to-br from-red-900 to-gray-950 text-white py-12 px-4 text-center">
        <p className="text-white/60 uppercase tracking-widest text-[0.7rem] sm:text-xs font-semibold mb-2 wrap-anywhere">
          WhatIsOnMyMenu.com
        </p>
        <h1 className="mx-auto max-w-full text-[clamp(1.75rem,7vw,3rem)] leading-tight font-serif font-bold tracking-tight sm:tracking-wide drop-shadow wrap-anywhere hyphens-auto">
          {t.title}
        </h1>
        <p className="mt-3 text-white/60 text-sm">
          {t.lastUpdated}: {lastUpdated}
        </p>
      </div>
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-16">
        {t.bindingNote && (
          <p className="text-sm text-gray-500 bg-white rounded-2xl border border-gray-100 p-4 wrap-anywhere hyphens-auto">
            {t.bindingNote}
          </p>
        )}

        <Section title={t.providerTitle}>
          <div className="text-sm text-gray-600 space-y-1 leading-relaxed wrap-anywhere">
            <p className="font-medium text-gray-800">{PROVIDER.name}</p>
            <p>{PROVIDER.street}</p>
            <p>{PROVIDER.city}</p>
            <p>{t.country}</p>
          </div>
        </Section>

        <Section title={t.contactTitle}>
          <div className="text-sm text-gray-600 space-y-1 wrap-anywhere">
            <p>
              {t.emailLabel}:{" "}
              <a href={`mailto:${PROVIDER.email}`} className="text-red-700 hover:underline">
                {PROVIDER.email}
              </a>
            </p>
          </div>
        </Section>

        <Section title={t.vatTitle}>
          <p className="text-sm text-gray-600 wrap-anywhere hyphens-auto">{t.vatText}</p>
        </Section>

        <Section title={t.responsibleTitle}>
          <div className="text-sm text-gray-600 space-y-1 wrap-anywhere">
            <p>{PROVIDER.name}</p>
            <p>{PROVIDER.street}</p>
            <p>{PROVIDER.city}</p>
          </div>
        </Section>

        {/* Kein Link zur EU-OS-Plattform mehr: die wurde zum 20.07.2025 abgeschaltet. */}
        <Section title={t.disputeTitle}>
          <p className="text-sm text-gray-600 wrap-anywhere hyphens-auto">{t.disputeText}</p>
        </Section>

        <Section title={t.contentLiabilityTitle}>
          <p className="text-sm text-gray-600 leading-relaxed wrap-anywhere hyphens-auto">{t.contentLiabilityText}</p>
        </Section>

        <Section title={t.linkLiabilityTitle}>
          <p className="text-sm text-gray-600 leading-relaxed wrap-anywhere hyphens-auto">{t.linkLiabilityText}</p>
        </Section>

        <Section title={t.copyrightTitle}>
          <p className="text-sm text-gray-600 leading-relaxed wrap-anywhere hyphens-auto">{t.copyrightText}</p>
        </Section>
      </main>
    </div>
  );
}
