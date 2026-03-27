export const revalidate = 600;

const FooterPart = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">🍽️ WhatsOnMyMenu</div>
            <p className="text-gray-400">Die einfachste Art, professionelle digitale Speisekarten zu erstellen.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produkt</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition-colors">
                  Preise
                </a>
              </li>
              <li>
                <a href="/templates" className="hover:text-white transition-colors">
                  Vorlagen
                </a>
              </li>
              <li>
                <a href="/integrations" className="hover:text-white transition-colors">
                  Integrationen
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/help" className="hover:text-white transition-colors">
                  Hilfe Center
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="/tutorials" className="hover:text-white transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="/api-docs" className="hover:text-white transition-colors">
                  API Docs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Unternehmen</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  Über uns
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white transition-colors">
                  Karriere
                </a>
              </li>
              <li>
                <a href="/press" className="hover:text-white transition-colors">
                  Presse
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2026 WhatsOnMyMenu. Alle Rechte vorbehalten.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Datenschutz
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              AGB
            </a>
            <a href="/imprint" className="text-gray-400 hover:text-white text-sm transition-colors">
              Impressum
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterPart;
