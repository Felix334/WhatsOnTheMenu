import Link from "next/link";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PublicHeader from "./PublicHeader";

// Über-uns-Seite.
//
// Bewusst OHNE Anbieterkennzeichnung: die Impressumspflicht erfuellt
// /Impressum. Standen die Angaben an zwei Stellen, konnten sie sich
// widersprechen — genau das war hier der Fall (die Seite behauptete eine GmbH
// samt Handelsregisternummer, waehrend das Impressum ein Einzelunternehmen
// ausweist). Rechtliches wird deshalb nur verlinkt, nie wiederholt.
//
// Ebenfalls bewusst eine Server-Komponente: die alte Fassung war nur wegen
// styled-jsx eine Client-Komponente und nutzte next/head, das im App Router
// wirkungslos ist.

export default function AboutPage({ dict, locale }) {
  const t = dict.about;

  return (
    <>
      <PublicHeader t={dict} locale={locale} />
      <main className="bg-white">
        <section className="bg-linear-to-br from-red-900 to-gray-950 px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-300 uppercase tracking-widest text-xs font-semibold mb-3">{t.eyebrow}</p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-5 leading-tight">{t.title}</h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">{t.intro}</p>
          </div>
        </section>

        <section className="px-4 py-16 max-w-3xl mx-auto">
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-red-800 text-white flex items-center justify-center text-xl font-bold shrink-0">FM</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{t.personTitle}</h2>
                  <p className="text-sm text-gray-500">{t.personRole}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{t.personText}</p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-gray-50 px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">{t.contactTitle}</h2>
            <p className="text-gray-500 mb-6">{t.contactText}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`mailto:${t.email}`} className="flex items-center gap-2 text-red-800 hover:text-red-900 font-medium">
                <Mail className="h-4 w-4 shrink-0" />
                {t.email}
              </a>
              <a href={`tel:${t.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-red-800 hover:text-red-900 font-medium">
                <Phone className="h-4 w-4 shrink-0" />
                {t.phone}
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">{t.legalTitle}</h2>
          <p className="text-gray-500 mb-6">{t.legalText}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Ohne Sprach-Praefix: die Rechtsseiten gibt es nur auf Deutsch. */}
            <Button asChild variant="outline">
              <Link href="/Impressum">
                {t.imprintLink} <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/privacy">
                {t.privacyLink} <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
