const LAST_UPDATED = "29. Mai 2026";

const sections = [
  {
    title: "§ 1 Geltungsbereich",
    content: [
      "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen WhatIsOnMyMenu.com (nachfolgend Anbieter) und den Nutzern der Plattform (nachfolgend Nutzer oder Kunde).",
      "Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.",
      "Die jeweils aktuelle Version der AGB ist auf der Website unter /AGBs abrufbar.",
    ],
  },
  {
    title: "§ 2 Leistungsbeschreibung",
    content: [
      "WhatIsOnMyMenu.com ist eine Software-as-a-Service-Plattform zur Erstellung, Verwaltung und Veröffentlichung digitaler Speisekarten für Gastronomiebetriebe.",
      "Der Anbieter stellt je nach gewähltem Tarif folgende Kernfunktionen bereit: Erstellung und Bearbeitung digitaler Speisekarten, Verwaltung von Kategorien und Gerichten, Generierung von QR-Codes sowie Bereitstellung einer öffentlich zugänglichen Menüansicht.",
      "Der genaue Funktionsumfang richtet sich nach dem jeweiligen Abonnement-Tarif (Starter, Business, Professional, Enterprise). Änderungen am Funktionsumfang werden den Nutzern rechtzeitig mitgeteilt.",
    ],
  },
  {
    title: "§ 3 Vertragsschluss und Registrierung",
    content: [
      "Der Vertrag kommt durch die Registrierung des Nutzers auf der Plattform und die Bestätigung dieser AGB zustande.",
      "Die Registrierung erfolgt ausschließlich über Google OAuth. Der Nutzer ist verpflichtet, wahrheitsgemäße Angaben zu machen und sein Konto vor unbefugtem Zugriff zu schützen.",
      "Ein Anspruch auf Registrierung besteht nicht. Der Anbieter behält sich das Recht vor, Registrierungen ohne Angabe von Gründen abzulehnen.",
      "Der Nutzer darf pro Betrieb nur ein Konto anlegen. Die Nutzung mehrerer Konten für denselben Betrieb ist untersagt.",
    ],
  },
  {
    title: "§ 4 Tarife und Preise",
    content: [
      "Der Anbieter bietet folgende Tarife an:",
      "• Starter (kostenlos): Bis zu 7 Kategorien, bis zu 50 Gerichte, Basis-Templates, QR-Code.",
      "• Business (7,99 €/Monat): Bis zu 15 Kategorien, bis zu 100 Gerichte, Basis-Templates, QR-Code.",
      "• Professional (14,99 €/Monat): Bis zu 25 Kategorien, bis zu 200 Gerichte, Premium-Templates, QR-Code, Event-Kalender, Verfügbarkeitsanzeige.",
      "• Enterprise (individuell): Individuell vereinbarte Leistungen.",
      "Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Der Anbieter behält sich Preisanpassungen vor, die dem Nutzer mindestens 30 Tage vor Inkrafttreten mitgeteilt werden.",
    ],
  },
  {
    title: "§ 5 Zahlung und Abrechnung",
    content: [
      "Kostenpflichtige Tarife werden monatlich im Voraus abgerechnet. Der Abrechnungszeitraum beginnt mit dem Tag der Buchung.",
      "Die Zahlung erfolgt über die auf der Plattform angebotenen Zahlungsmethoden. Bei Zahlungsverzug ist der Anbieter berechtigt, den Zugang zu kostenpflichtigen Funktionen bis zur vollständigen Begleichung der offenen Beträge zu sperren.",
      "Rückerstattungen werden nur in gesetzlich vorgesehenen Fällen gewährt.",
    ],
  },
  {
    title: "§ 6 Laufzeit und Kündigung",
    content: [
      "Der Starter-Tarif ist unbefristet und kann jederzeit durch Löschung des Kontos beendet werden.",
      "Kostenpflichtige Tarife haben eine monatliche Laufzeit und können mit einer Frist von 7 Tagen zum Ende des jeweiligen Abrechnungszeitraums gekündigt werden.",
      "Die Kündigung erfolgt in Textform (E-Mail) oder über die Kontoeinstellungen auf der Plattform.",
      "Der Anbieter ist berechtigt, das Nutzerkonto bei schwerwiegenden Verstößen gegen diese AGB mit sofortiger Wirkung zu kündigen.",
    ],
  },
  {
    title: "§ 7 Pflichten des Nutzers",
    content: [
      "Der Nutzer ist verantwortlich für alle Inhalte, die er auf der Plattform einstellt (Gerichte, Bilder, Beschreibungen, Preise). Er stellt sicher, dass diese Inhalte zutreffend, vollständig und rechtlich unbedenklich sind.",
      "Der Nutzer ist verpflichtet, die geltenden Kennzeichnungspflichten für Speisen und Allergene (insbesondere die EU-Lebensmittelinformationsverordnung Nr. 1169/2011) einzuhalten.",
      "Folgende Nutzungen sind untersagt: Einstellung rechtswidriger, irreführender oder beleidigender Inhalte; Verwendung der Plattform für Spam oder unerwünschte Werbung; Manipulation der Plattform oder ihrer Infrastruktur; Weitergabe von Zugangsdaten an Dritte.",
    ],
  },
  {
    title: "§ 8 Urheberrecht und Lizenzen",
    content: [
      "Der Nutzer räumt dem Anbieter mit Einstellung von Inhalten (Bilder, Texte etc.) eine einfache, nicht übertragbare Lizenz ein, diese Inhalte zum Zweck der Bereitstellung des Dienstes zu verwenden, zu speichern und anzuzeigen.",
      "Die Plattform, ihre Software sowie alle vom Anbieter erstellten Inhalte und Designs sind urheberrechtlich geschützt und dürfen ohne ausdrückliche Genehmigung nicht vervielfältigt oder verbreitet werden.",
    ],
  },
  {
    title: "§ 9 Verfügbarkeit und Wartung",
    content: [
      "Der Anbieter strebt eine Verfügbarkeit der Plattform von 99 % im Jahresdurchschnitt an. Wartungsarbeiten werden nach Möglichkeit in Zeiten geringer Nutzung durchgeführt und vorab angekündigt.",
      "Ein Anspruch auf ununterbrochene Verfügbarkeit besteht nicht. Der Anbieter haftet nicht für Ausfälle, die auf Umstände außerhalb seines Einflussbereichs zurückzuführen sind (z. B. höhere Gewalt, Ausfall von Drittanbietern).",
    ],
  },
  {
    title: "§ 10 Haftungsbeschränkung",
    content: [
      "Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für vorsätzlich oder grob fahrlässig verursachte Schäden.",
      "Für einfache Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), und zwar auf den vorhersehbaren, vertragstypischen Schaden begrenzt.",
      "Eine weitergehende Haftung des Anbieters ist ausgeschlossen. Der Anbieter übernimmt keine Haftung für die inhaltliche Richtigkeit der vom Nutzer eingestellten Speisekarten-Informationen.",
    ],
  },
  {
    title: "§ 11 Datenschutz",
    content: [
      "Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung des Anbieters, die unter /privacy abrufbar ist.",
      "Zur Authentifizierung wird Google OAuth eingesetzt. Dabei gelten zusätzlich die Datenschutzbestimmungen von Google (Google LLC).",
    ],
  },
  {
    title: "§ 12 Änderungen der AGB",
    content: [
      "Der Anbieter behält sich das Recht vor, diese AGB jederzeit mit Wirkung für die Zukunft zu ändern. Änderungen werden dem Nutzer mindestens 30 Tage vor Inkrafttreten per E-Mail oder über eine Benachrichtigung auf der Plattform mitgeteilt.",
      "Widerspricht der Nutzer den geänderten AGB nicht innerhalb von 30 Tagen nach Bekanntgabe, gelten die neuen AGB als akzeptiert. Auf dieses Widerspruchsrecht und die Folgen des Schweigens wird im Rahmen der Bekanntgabe ausdrücklich hingewiesen.",
    ],
  },
  {
    title: "§ 13 Schlussbestimmungen",
    content: [
      "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).",
      "Ist der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand der Sitz des Anbieters.",
      "Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
    ],
  },
];

export default function AGBsPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 text-white py-12 px-4 text-center">
        <p className="text-amber-200 uppercase tracking-widest text-xs font-semibold mb-2">
          WhatIsOnMyMenu.com
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-wide drop-shadow">
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="mt-3 text-amber-100 text-sm">Stand: {LAST_UPDATED}</p>
      </div>

      {/* Hinweis-Banner */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="bg-amber-100 border border-amber-300 rounded-xl px-5 py-4 text-sm text-amber-800">
          <strong>Hinweis:</strong> Diese AGBs wurden für informatorische Zwecke erstellt. Bitte lassen Sie sie vor der Veröffentlichung von einem Rechtsanwalt prüfen.
        </div>
      </div>

      {/* Inhalt */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-16">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.content.map((paragraph, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* Footer-Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 sm:p-8 text-sm text-gray-500 space-y-1">
          <p className="font-semibold text-gray-700">Anbieter</p>
          <p>WhatIsOnMyMenu.com</p>
          <p>E-Mail: <a href="mailto:" className="text-amber-600 hover:underline"></a></p>
        </div>
      </main>
    </div>
  );
}
