import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDictionary, buildAlternates } from "@/i18n";
import { localizedPath } from "@/i18n/config";
import PublicHeader from "@/app/components/PublicHeader";

// Tarifuebersicht fuer die uebersetzten Sprachen.
//
// Bewusst OHNE die Checkout-Formulare der deutschen /pricing-Seite: die
// enthaelt eine Unternehmer-Bestaetigung samt Widerrufsbelehrung nach
// deutschem Recht. Eine uebersetzte Fassung dieser Zustimmung haette eine
// andere rechtliche Bedeutung — der Vertragsabschluss laeuft deshalb
// weiterhin ueber die deutsche Strecke.
//
// Der SEO-Zweck ist damit trotzdem erfuellt: die Seite rankt auf
// "QR code menu pricing" und fuehrt den Interessenten zum Abschluss.

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

function PlanCard({ name, price, features, action, highlight, badge }) {
  return (
    <Card className={`flex flex-col h-full ${highlight ? "border-2 border-amber-400 relative" : ""}`}>
      {badge && <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900">{badge}</Badge>}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="text-3xl font-bold">{price}</div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ul className="space-y-3 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-auto">{action}</div>
      </CardContent>
    </Card>
  );
}

export default async function IntlPricingPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.pricingOverview;
  const plans = dict.home.pricing;

  return (
    <>
      <PublicHeader t={dict} locale={locale} />
      <main className="bg-gray-50 min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </div>

        {/* Hinweis auf die deutschsprachige Vertragsstrecke — bewusst sichtbar,
            damit niemand vom Sprachwechsel im Checkout ueberrascht wird. */}
        <p className="text-sm text-gray-500 text-center max-w-2xl mx-auto mb-14">{t.checkoutNote}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          <PlanCard
            name={plans.starter.name}
            price={plans.free}
            features={plans.starter.features}
            action={
              <Button asChild className="w-full">
                <Link href={localizedPath("/ErstelleRestaurantAccount/FreeTier", locale)}>{t.freeCta}</Link>
              </Button>
            }
          />
          <PlanCard
            name={plans.business.name}
            price={
              <>
                7.99€<span className="text-lg font-normal">{plans.perMonth}</span>
              </>
            }
            features={plans.business.features}
            highlight
            action={
              <Button asChild className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900">
                <Link href={localizedPath("/ErstelleRestaurantAccount/Business", locale)}>{t.cta}</Link>
              </Button>
            }
          />
          <PlanCard name={plans.professional.name} price={<span className="text-lg font-normal">{plans.perMonth}</span>} features={plans.professional.features} badge={plans.comingSoon} action={null} />
        </div>
      </div>
      </main>
    </>
  );
}
