const LAST_UPDATED = "31. Mai 2026";

export const metadata = {
  title: "Datenschutzerklärung | WhatIsOnMyMenu.com",
  description:
    "Informationen gemäß DSGVO zur Verarbeitung personenbezogener Daten bei der Nutzung von WhatIsOnMyMenu.com.",
};

const sections = [
  {
    title: "1. Verantwortlicher",
    content: [
      "Verantwortlicher im Sinne der DSGVO ist:",
      "Felix Mayer\nMühlenblick 16\n74372 Sersheim\nDeutschland",
      "E-Mail: support@whatisonmymenu.com",
    ],
  },
  {
    title: "2. Welche Daten wir verarbeiten",
    content: [
      "Beim Betrieb von WhatIsOnMyMenu.com verarbeiten wir folgende personenbezogene Daten:",
      "• Kontodaten: Name, E-Mail-Adresse und Profilbild, die bei der Anmeldung über Google OAuth übermittelt werden.",
      "• Restaurantdaten: Firmenname, Adresse, Öffnungszeiten sowie Speisekarten-Inhalte (Kategorien, Gerichte, Bilder, Preise, Allergene), die Sie selbst einpflegen.",
      "• Zahlungsdaten: Transaktionsreferenzen und Abonnement-Status. Vollständige Zahlungsdaten (Kartennummer etc.) werden ausschließlich von Stripe verarbeitet und nicht von uns gespeichert.",
      "• Nutzungsdaten: IP-Adresse, Browser-Typ, aufgerufene Seiten und Zeitstempel (für Sicherheit und Fehleranalyse).",
    ],
  },
  {
    title: "3. Zweck und Rechtsgrundlage der Verarbeitung",
    content: [
      "Wir verarbeiten Ihre Daten für folgende Zwecke:",
      "• Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO): Bereitstellung der Plattform-Funktionen, Verwaltung Ihres Kontos, Abrechnung von Abonnements.",
      "• Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO): Sicherheit der Plattform, Betrugsprävention, technischer Betrieb.",
      "• Rechtliche Verpflichtungen (Art. 6 Abs. 1 lit. c DSGVO): Aufbewahrung von Rechnungsdaten gemäß steuerrechtlicher Vorschriften (§ 147 AO).",
    ],
  },
  {
    title: "4. Eingesetzte Drittanbieter",
    content: [
      "Google OAuth (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA): Zur Authentifizierung nutzen wir Google OAuth. Dabei werden Ihr Google-Profil-Name, Ihre E-Mail-Adresse und Ihr Profilbild an uns übermittelt. Datenschutzrichtlinie: https://policies.google.com/privacy",
      "Stripe (Stripe, Inc., 510 Townsend Street, San Francisco, CA 94103, USA): Zur Abwicklung von Zahlungen nutzen wir Stripe. Stripe verarbeitet Ihre Zahlungsdaten eigenverantwortlich. Datenschutzrichtlinie: https://stripe.com/de/privacy",
      "Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA): Für Sicherheit, DDoS-Schutz und CDN-Dienste. Cloudflare verarbeitet dabei Verbindungsdaten (IP-Adresse, HTTP-Header). Datenschutzrichtlinie: https://www.cloudflare.com/privacypolicy/",
      "Die Übermittlung von Daten in die USA erfolgt auf Grundlage des EU-US Data Privacy Framework bzw. Standardvertragsklauseln gemäß Art. 46 DSGVO.",
    ],
  },
  {
    title: "5. Cookies",
    content: [
      "Wir setzen ausschließlich technisch notwendige Cookies ein, die für den Betrieb der Plattform erforderlich sind:",
      "• Session-Cookies: Für die Verwaltung Ihrer Anmeldung (NextAuth.js). Diese bleiben nach Sitzungsende erhalten.",
      "• Zum Löschen der Session-Cookies bitte im Meü abmelden",
      "• Sicherheits-Cookies: Von Cloudflare zur Erkennung und Abwehr von Angriffen.",
      "• Zahlungs-Cookies: Von Stripe zur sicheren Abwicklung von Transaktionen.",
      "Da es sich ausschließlich um technisch notwendige Cookies handelt, ist für deren Einsatz keine Einwilligung erforderlich (§ 25 Abs. 2 TDDDG).",
    ],
  },
  {
    title: "6. Speicherdauer",
    content: [
      "Kontodaten werden für die Dauer der Vertragsbeziehung gespeichert und danach innerhalb von 30 Tagen gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      "Rechnungsrelevante Daten werden gemäß § 147 AO für 10 Jahre aufbewahrt.",
      "Hochgeladene Bilder und Speisekarten-Inhalte werden nach Kontolöschung innerhalb von 30 Tagen gelöscht.",
    ],
  },
  {
    title: "7. Ihre Rechte",
    content: [
      "Sie haben folgende Rechte gegenüber uns bezüglich Ihrer personenbezogenen Daten:",
      "• Auskunft (Art. 15 DSGVO): Sie können Auskunft über die von uns verarbeiteten Daten verlangen.",
      "• Berichtigung (Art. 16 DSGVO): Sie können die Berichtigung unrichtiger Daten verlangen.",
      "• Löschung (Art. 17 DSGVO): Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      "• Einschränkung (Art. 18 DSGVO): Sie können die Einschränkung der Verarbeitung verlangen.",
      "• Datenübertragbarkeit (Art. 20 DSGVO): Sie können Ihre Daten in einem strukturierten Format erhalten.",
      "• Widerspruch (Art. 21 DSGVO): Sie können der Verarbeitung auf Basis berechtigter Interessen widersprechen.",
      "Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an: support@whatisonmymenu.com",
    ],
  },
  {
    title: "8. Beschwerderecht",
    content: [
      "Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Die zuständige Aufsichtsbehörde richtet sich nach Ihrem Wohnort bzw. dem Sitz des Unternehmens.",
      "Eine Liste der Aufsichtsbehörden finden Sie unter: https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html",
    ],
  },
  {
    title: "9. Änderungen dieser Datenschutzerklärung",
    content: [
      "Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren. Die aktuelle Version ist stets unter /privacy abrufbar. Bei wesentlichen Änderungen informieren wir Sie per E-Mail.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-linear-to-br from-red-900 to-gray-950 text-white py-12 px-4 text-center">
        <p className="text-white/60 uppercase tracking-widest text-[0.7rem] sm:text-xs font-semibold mb-2 wrap-anywhere">
          WhatIsOnMyMenu.com
        </p>
        <h1 className="mx-auto max-w-full text-[clamp(1.5rem,6.5vw,3rem)] leading-tight font-serif font-bold tracking-tight sm:tracking-wide drop-shadow wrap-anywhere hyphens-auto">
          Datenschutzerklärung
        </h1>
        <p className="mt-3 text-white/60 text-sm">Stand: {LAST_UPDATED}</p>
      </div>

      {/* Inhalt */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-16">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100 wrap-anywhere hyphens-auto">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.content.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-gray-600 text-sm leading-relaxed whitespace-pre-line wrap-anywhere hyphens-auto"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* Kontakt */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-sm text-gray-500 space-y-1 wrap-anywhere">
          <p className="font-semibold text-gray-700">Kontakt Datenschutz</p>
          <p>Felix Mayer</p>
          <p>
            E-Mail:{" "}
            <a href="mailto:support@whatisonmymenu.com" className="text-red-700 hover:underline">
              support@whatisonmymenu.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
