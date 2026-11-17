import { getDictionary, buildAlternates } from "@/i18n";
import PublicHeader from "@/app/components/PublicHeader";
import PricingPlans from "@/app/components/PricingPlans";

// Tarifseite mit Checkout, fuer alle Sprachen: /pricing (Englisch) und
// /de/pricing. Die Kopfzeile ist eine Server-Komponente und sitzt deshalb hier,
// die Karten samt Checkout-Dialogen sind Client-Komponente (Session, Stripe).
//
// Die Checkout-Zustimmung (Unternehmer + Widerruf) ist in beiden Sprachen
// enthalten. AGB und Widerrufsbelehrung selbst gibt es nur auf Deutsch; die
// englische Fassung sagt das ausdruecklich (pricingPage.consent.bindingNote).

export const dynamic = "force-static";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.meta.pricing.title,
    description: t.meta.pricing.description,
    alternates: buildAlternates("/pricing", locale),
  };
}

export default async function PricingPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PublicHeader t={dict} locale={locale} />
      <PricingPlans t={dict.pricingPage} fields={dict.signup.fields} plans={dict.home.pricing} locale={locale} />
    </>
  );
}
