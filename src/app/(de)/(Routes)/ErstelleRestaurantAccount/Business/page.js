"use client";

import RestaurantCheckoutForm from "@/app/components/RestaurantCheckoutForm";
import de from "@/i18n/de";

export default function BusinessPage() {
  return <RestaurantCheckoutForm t={de.signupCheckout} tShared={de.signup} locale="de" />;
}
