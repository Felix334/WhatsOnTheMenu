"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import de from "@/i18n/de";
import { localizedPath } from "@/i18n/config";

// Datenschutz, AGB und Widerruf bleiben bewusst deutsch und liegen ohne
// Sprach-Praefix — es sind Dokumente nach deutschem Recht. Uebersetzt werden
// dort nur die Link-Beschriftungen. Das Impressum gibt es zusaetzlich auf
// Englisch (/legal-notice, deutsche Fassung /de/Impressum bleibt massgeblich).
const FooterPart = ({ t = de.footer, locale = "de" }) => {
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const suffix = queryString ? `?${queryString}` : "";
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">🍽️ WhatIsOnMyMenu</div>
            <p className="text-gray-400">{t.tagline}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.product}</h4>
            <ul className="space-y-2 text-gray-400"></ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.support}</h4>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.company}</h4>
            <ul className="space-y-2 text-gray-400"></ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2026 WhatIsOnMyMenu. {t.rights}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link className="text-gray-400 text-sm" href={`/privacy${suffix}`}>
              {t.privacy}
            </Link>
            <Link className="text-gray-400 text-sm" href={`/AGBs${suffix}`}>
              {t.terms}
            </Link>
            <Link className="text-gray-400 text-sm" href={`/Widerruf${suffix}`}>
              {t.withdrawal}
            </Link>
            <Link className="text-gray-400 text-sm" href={`${localizedPath("/Impressum", locale)}${suffix}`}>
              {t.imprint}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterPart;
