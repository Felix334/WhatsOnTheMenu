import RestaurantCheckoutForm from "@/app/components/RestaurantCheckoutForm";
import { getDictionary } from "@/i18n";

export default async function IntlBusinessPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return <RestaurantCheckoutForm t={dict.signupCheckout} tShared={dict.signup} locale={locale} />;
}
