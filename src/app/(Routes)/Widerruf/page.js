const LAST_UPDATED = "05. Juli 2026";

export const metadata = {
  title: "Widerrufsrecht | WhatIsOnMyMenu.com",
  description:
    "Informationen zum gesetzlichen Widerrufsrecht bei Verträgen mit WhatIsOnMyMenu.com sowie Muster-Widerrufsformular für Verbraucher.",
};

const sections = [
  {
    title: "Widerrufsrecht für Verbraucher",
    content: [
      "Verbrauchern (§ 13 BGB) steht bei Verträgen, die ausschließlich über Fernkommunikationsmittel geschlossen werden, ein gesetzliches Widerrufsrecht zu.",
      "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.",
      "Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Kontaktdaten siehe unten) mittels einer eindeutigen Erklärung (z. B. per E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.",
      "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
    ],
  },
  {
    title: "Folgen des Widerrufs",
    content: [
      "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.",
      "Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
      "Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.",
    ],
  },
  {
    title: "Vorzeitiges Erlöschen des Widerrufsrechts",
    content: [
      "Das Widerrufsrecht erlischt bei einem Vertrag über die Erbringung von Dienstleistungen vorzeitig, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung der Dienstleistung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren (§ 356 Abs. 4 BGB).",
      "Bei Verträgen über die Bereitstellung digitaler Inhalte, die nicht auf einem körperlichen Datenträger geliefert werden, erlischt das Widerrufsrecht, wenn wir mit der Ausführung des Vertrags begonnen haben, nachdem Sie ausdrücklich zugestimmt haben, dass wir vor Ablauf der Widerrufsfrist mit der Ausführung beginnen, und Sie Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung Ihr Widerrufsrecht verlieren (§ 356 Abs. 5 BGB).",
      "Beim Abschluss eines Abonnements auf unserer Plattform holen wir diese Zustimmung und Kenntnisnahme vor dem Bezahlvorgang ausdrücklich ein.",
    ],
  },
  {
    title: "Kein Widerrufsrecht für Unternehmer",
    content: [
      "Das gesetzliche Widerrufsrecht gilt ausschließlich für Verbraucher.",
      "Unsere Plattform richtet sich an Gastronomiebetriebe. Handeln Sie beim Vertragsschluss in Ausübung Ihrer gewerblichen oder selbständigen beruflichen Tätigkeit (Unternehmer i. S. d. § 14 BGB), besteht kein Widerrufsrecht.",
    ],
  },
  {
    title: "Muster-Widerrufsformular",
    content: [
      "Wenn Sie den Vertrag widerrufen wollen, können Sie folgendes Formular ausfüllen und an uns zurücksenden:",
      "— An: WhatIsOnMyMenu.com, Felix Mayer, Mühlenblick 16, 74372 Sersheim, Deutschland",
      "— Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: …",
      "— Bestellt am (*)/erhalten am (*): …",
      "— Name des/der Verbraucher(s): …",
      "— Anschrift des/der Verbraucher(s): …",
      "— Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): …",
      "— Datum: …",
      "(*) Unzutreffendes streichen.",
    ],
  },
];

export default function WiderrufPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-linear-to-br from-red-900 to-gray-950 text-white py-12 px-4 text-center">
        <p className="text-white/60 uppercase tracking-widest text-xs font-semibold mb-2">
          WhatIsOnMyMenu.com
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-wide drop-shadow">
          Widerrufsbelehrung
        </h1>
        <p className="mt-3 text-white/60 text-sm">Stand: {LAST_UPDATED}</p>
      </div>

      {/* Inhalt */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-16">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
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

        {/* Kontakt */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-sm text-gray-500 space-y-1">
          <p className="font-semibold text-gray-700">Widerruf richten an</p>
          <p>WhatIsOnMyMenu.com</p>
          <p>Felix Mayer</p>
          <p>Mühlenblick 16</p>
          <p>74372 Sersheim, Deutschland</p>
          <p>
            E-Mail:{" "}
            <a href="mailto:" className="text-red-700 hover:underline">
              [DEINE E-MAIL-ADRESSE]
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
