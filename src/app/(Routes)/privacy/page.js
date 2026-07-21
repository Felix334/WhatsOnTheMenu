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
      "E-Mail: [DEINE E-MAIL-ADRESSE]",
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
      "Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an: [DEINE E-MAIL-ADRESSE]",
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
    <div className="min-h-screen bg-amber-50">
      <div className="w-full bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 text-white py-12 px-4 text-center">
        <p className="text-amber-200 uppercase tracking-widest text-xs font-semibold mb-2">
          WhatIsOnMyMenu.com
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-wide drop-shadow">
          Datenschutzerklärung
        </h1>
        <p className="mt-3 text-amber-100 text-sm">Stand: {LAST_UPDATED}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="bg-amber-100 border border-amber-300 rounded-xl px-5 py-4 text-sm text-amber-800">
          <strong>Hinweis:</strong> Ersetzen Sie alle Angaben in eckigen Klammern durch Ihre tatsächlichen Daten. Lassen Sie dieses Dokument vor der Veröffentlichung von einem Rechtsanwalt prüfen.
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-16">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.content.map((paragraph, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 sm:p-8 text-sm text-gray-500 space-y-1">
          <p className="font-semibold text-gray-700">Kontakt Datenschutz</p>
          <p>Felix Mayer</p>
          <p>
            E-Mail:{" "}
            <a href="mailto:" className="text-amber-600 hover:underline">
              [DEINE E-MAIL-ADRESSE]
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
