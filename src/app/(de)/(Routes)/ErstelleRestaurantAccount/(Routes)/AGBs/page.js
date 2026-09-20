"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Annahme: shadcn/ui installiert
import { Separator } from "@/components/ui/separator"; // Für Divider
import { Download, Mail, FileText } from "lucide-react"; // Icons aus Lucide React (npm install lucide-react)
import { Button } from "@/components/ui/button";


export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      {/* Header Card */}
      <div className="container mx-auto max-w-4xl">
        <Card className="mx-auto max-w-3xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Allgemeine Geschäftsbedingungen</h1>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">Hier finden Sie die rechtlichen Bedingungen für die Nutzung unserer Plattform. Lesen Sie diese sorgfältig durch, bevor Sie sich registrieren.</p>
          </CardHeader>
        </Card>

        <Separator className="my-8 mx-auto w-1/2 bg-gray-300" />

        {/* Inhaltsbereich */}
        <div className="space-y-8">
          <ol className="list-decimal space-y-0">
            {[
              {
                number: 1,
                title: "Einleitung und Geltungsbereich",
                content: [
                  "Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der Plattform <strong>RestaurantRegister.de</strong> (im Folgenden „Plattform“) durch Unternehmer, die ein Restaurant oder eine Gaststätte registrieren möchten (im Folgenden „Nutzer“ oder „Restaurantbetreiber“).",
                  "Die Plattform wird von <strong>Plattform GmbH</strong>, mit Sitz in <strong>Musterstraße 1, 10115 Berlin</strong>, vertreten durch <strong>Max Mustermann (Geschäftsführer)</strong>, betrieben (im Folgenden „Anbieter“).",
                  "Die AGB gelten für alle Verträge zwischen dem Anbieter und dem Nutzer. Abweichende oder ergänzende Bedingungen des Nutzers bedürfen der schriftlichen Zustimmung des Anbieters.",
                  "Durch die Registrierung und Akzeptanz dieser AGB schließt der Nutzer einen verbindlichen Vertrag mit dem Anbieter ab.",
                ],
              },
              {
                number: 2,
                title: "Schlussfolgerung des Vertrags",
                content: ["Der Vertrag kommt durch erfolgreiche Registrierung auf der Plattform und explizite Akzeptanz der AGB zustande.", "Der Nutzer ist verpflichtet, wahrheitsgemäße Angaben zu machen (z. B. Firmenname, Adresse, USt-ID). Falschangaben berechtigen den Anbieter zur Kündigung des Vertrags.", "Der Anbieter behält sich vor, Registrierungen abzulehnen, wenn sie gegen gesetzliche Vorgaben (z. B. Hygienekonzept, Impressumspflicht) verstoßen.", "Es besteht kein Anspruch auf Registrierung. Der Anbieter prüft die Angaben und bestätigt die Annahme per E-Mail."],
              },
              {
                number: 3,
                title: "Leistungen des Anbieters",
                content: ["Der Anbieter stellt die Plattform zur Verfügung, um Restaurants zu registrieren und zu verwalten (z. B. Erstellung eines Profils, Sichtbarkeit für Kunden, Unterstützung bei rechtlichen Anforderungen wie Impressum oder Datenschutz).", "Leistungen umfassen: Profilverwaltung, Beratung zu AGB/Datenschutz, Integration von Menübeschreibungen.", "Die Plattform ist online verfügbar, jedoch ohne Garantie für eine unterbrechungsfreie Verfügbarkeit (z. B. Wartungsarbeiten möglich).", "Der Anbieter aktualisiert die Plattform laufend, haftet jedoch nicht für Kompatibilitätsprobleme mit Nutzergeräten."],
              },
              {
                number: 4,
                title: "Pflichten des Nutzers",
                content: ["Der Nutzer verpflichtet sich, alle Pflichtfelder wahrheitsgemäß auszufüllen und gesetzliche Anforderungen zu erfüllen (z. B. Hygienekonzept nach § 4 IfSG, Allergen-Kennzeichnung nach LMIV, Impressum nach § 5 TMG).", "Der Nutzer ist für die Richtigkeit und Aktualität seiner Daten verantwortlich und muss Änderungen (z. B. Adresse) unverzüglich mitteilen.", "Verbotene Handlungen: Missbrauch der Plattform (z. B. Spam, illegale Inhalte), Verletzung von Rechten Dritter (z. B. Urheberrechte an Bildern).", "Der Nutzer gewährleistet, dass er berechtigt ist, die Plattform zu nutzen (z. B. als Geschäftsführer oder bevollmächtigte Person).", "Bei Verletzung dieser Pflichten kann der Anbieter den Zugang sperren oder den Vertrag kündigen."],
              },
              {
                number: 5,
                title: "Vergütung und Zahlungen",
                content: ["Die Nutzung der Plattform ist kostenlos für Basis-Registrierung, Premium ab € 19/Monat.", "Zahlungen erfolgen per SEPA-Lastschrift, Kreditkarte oder PayPal. Der Nutzer autorisiert den Anbieter zur Abbuchung.", "Mahngebühren und Zinsen bei Zahlungsverzug: Verzugszinsen i. S. v. § 288 BGB.", "Keine Rückerstattung bei vorzeitiger Kündigung, es sei denn, gesetzlich vorgeschrieben."],
              },
              {
                number: 6,
                title: "Haftung",
                content: ["Der Anbieter haftet uneingeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.", "Bei leichter Fahrlässigkeit haftet der Anbieter nur für Schäden, die aus der Verletzung wesentlicher Vertragspflichten resultieren (Kardinalpflichten).", "Der Anbieter haftet nicht für indirekte Schäden (z. B. entgangener Gewinn) oder Schäden durch Nutzerfehler.", "Der Nutzer haftet für Schäden, die durch seine Angaben oder Handlungen entstehen (z. B. falsche USt-ID, die zu Strafen führt).", "Die Haftung ist auf den vierfachen Jahresentgeltbetrag begrenzt."],
              },
              {
                number: 7,
                title: "Datenschutz",
                content: ["Der Anbieter verarbeitet personenbezogene Daten gemäß der <a href='/privacy' className='text-primary underline hover:text-primary/80'>Datenschutzerklärung</a>.", "Der Nutzer stimmt der Verarbeitung seiner Daten (z. B. E-Mail, Adresse) für Zwecke der Registrierung und Plattformnutzung zu.", "Der Nutzer hat das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch (DSGVO).", "Cookies und Tracking: Die Plattform verwendet Cookies; der Nutzer kann diese ablehnen, was die Funktionalität einschränken kann."],
              },
              {
                number: 8,
                title: "Kündigung und Vertragsdauer",
                content: ["Der Vertrag hat eine unbestimmte Laufzeit und kann von beiden Parteien mit einer Frist von 1 Monat zum Monatsende gekündigt werden.", "Außerordentliche Kündigung ist möglich bei wesentlichen Vertragsverletzungen (z. B. Nichtzahlung, Rechtsverstoß).", "Nach Kündigung werden Daten gelöscht, es sei denn, gesetzliche Aufbewahrungspflichten (z. B. 10 Jahre für Buchhaltung) bestehen.", "Der Nutzer kann das Profil selbst deaktivieren, was der Kündigung gleichkommt."],
              },
              {
                number: 9,
                title: "Eigentum und Rechte",
                content: ["Alle Rechte an der Plattform (Software, Designs, Inhalte) bleiben beim Anbieter. Der Nutzer erhält nur ein einfaches Nutzungsrecht.", "Der Nutzer gewährt dem Anbieter ein unentgeltliches, einfaches Nutzungsrecht an hochgeladenen Inhalten (z. B. Menübeschreibungen) für die Plattformnutzung.", "Keine Übertragung des Vertrags ohne Zustimmung des Anbieters."],
              },
              {
                number: 10,
                title: "Schlussbestimmungen",
                content: ["Änderungen der AGB: Der Anbieter kündigt Änderungen mindestens 2 Monate im Voraus an. Fortgesetzte Nutzung gilt als Zustimmung.", "Schriftform: Änderungen oder Ergänzungen bedürfen der Schriftform, es sei denn, etwas anderes vereinbart.", "Gerichtsstand: Gerichtsstand ist der Sitz des Anbieters (Amtsgericht Berlin).", "Salvatorische Klausel: Sollte eine Bestimmung unwirksam sein, bleibt der Vertrag im Übrigen wirksam.", "Geltendes Recht: Deutsches Recht unter Ausschluss des UN-Kaufrechts."],
              },
            ].map((section, index) => (
              <li key={section.number} className="list-item">
                <Card className={`mx-auto max-w-3xl shadow-md border-primary/20 hover:shadow-lg transition-shadow duration-300 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl font-bold text-primary w-8 text-center">{section.number}.</span>
                      <h2 className="text-2xl font-semibold text-gray-800 leading-tight">{section.title}</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-3">
                      {section.content.map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-0" dangerouslySetInnerHTML={{ __html: paragraph }} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {index < 9 && <Separator className="my-4 mx-auto w-3/4 bg-gray-200" />}
              </li>
            ))}
          </ol>
        </div>

        {/* Footer Card */}
        <Card className="mx-auto max-w-3xl mt-12 shadow-md border-0 bg-white/80">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <p className="text-sm">
                Diese AGB wurden zuletzt am <strong>01.10.2024</strong> aktualisiert. Bei Fragen kontaktieren Sie uns unter{" "}
                <a href="mailto:info@restaurantregister.de" className="text-primary underline hover:text-primary/80 font-medium">
                  info@restaurantregister.de
                </a>
                .
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href="/agb.pdf" // Ersetze durch tatsächlichen PDF-Download-Link
                download
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                AGB als PDF herunterladen
              </a>
              <Button onClick={() => window.print()} className="inline-flex items-center space-x-2 px-4 py-2">
                <FileText className="h-4 w-4" />
                Drucken (PDF speichern)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
