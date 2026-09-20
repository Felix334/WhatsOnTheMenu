import TierChooser from "@/app/components/TierChooser";
import { getDictionary } from "@/i18n";

export default async function IntlTierPage({ params }) {
  const { locale } = await params;
  return <TierChooser t={getDictionary(locale).tierChooser} locale={locale} />;
}
