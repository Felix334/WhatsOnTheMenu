import RestaurantSignupForm from "@/app/components/RestaurantSignupForm";
import { getDictionary } from "@/i18n";

export default async function IntlFreeTierPage({ params }) {
  const { locale } = await params;
  return <RestaurantSignupForm t={getDictionary(locale).signup} locale={locale} />;
}
