const LAST_UPDATED = "31. Mai 2026";

export const metadata = {
  title: "Impressum | WhatIsOnMyMenu.com",
  description:
    "Impressum und Anbieterkennzeichnung gemäß § 5 TMG von WhatIsOnMyMenu.com – der Plattform für digitale Speisekarten per QR-Code.",
};

export default function ImprintPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-linear-to-br from-red-900 to-gray-950 text-white py-12 px-4 text-center">
        <p className="text-white/60 uppercase tracking-widest text-xs font-semibold mb-2">
          WhatIsOnMyMenu.com
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-wide drop-shadow">
          Impressum
        </h1>
        <p className="mt-3 text-white/60 text-sm">Stand: {LAST_UPDATED}</p>
      </div>
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-16">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Angaben gemäß § 5 TMG
          </h2>
          <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
            <p className="font-medium text-gray-800">Felix Mayer</p>
            <p>Mühlenblick 16</p>
            <p>74372 Sersheim</p>
            <p>Deutschland</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Kontakt
          </h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              E-Mail:{" "}
              <a href="mailto:support@whatisonmymenu.com" className="text-red-700 hover:underline">
                support@whatisonmymenu.com
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Umsatzsteuer-ID
          </h2>
          <p className="text-sm text-gray-600">
            Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [UST-ID ODER &quot;nicht vorhanden, da Kleinunternehmer gemäß § 19 UStG&quot;]
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Felix Mayer</p>
            <p>Mühlenblick 16</p>
            <p>74372 Sersheim</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Streitschlichtung
          </h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Haftung für Inhalte
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Haftung für Links
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Urheberrecht
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </div>

      </main>
    </div>
  );
}
