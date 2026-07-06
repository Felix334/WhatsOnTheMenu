"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FooterPart = () => {
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">🍽️ WhatIsOnMyMenu</div>
            <p className="text-gray-400">Die einfachste Art, professionelle digitale Speisekarten zu erstellen.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produkt</h4>
            <ul className="space-y-2 text-gray-400"></ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Unternehmen</h4>
            <ul className="space-y-2 text-gray-400"></ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2026 WhatIsOnMyMenu. Alle Rechte vorbehalten.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link className="text-gray-400 text-sm" href={`/privacy${queryString ? `?${queryString}` : ""}`}>
              Datenschutz
            </Link>
            <Link className="text-gray-400 text-sm" href={`/AGBs${queryString ? `?${queryString}` : ""}`}>
              AGB
            </Link>
            <Link className="text-gray-400 text-sm" href={`/Widerruf${queryString ? `?${queryString}` : ""}`}>
              Widerruf
            </Link>
            <Link className="text-gray-400 text-sm" href={`/Impressum${queryString ? `?${queryString}` : ""}`}>
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterPart;
