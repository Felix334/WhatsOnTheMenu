"use client";

import RestaurantSignupForm from "@/app/components/RestaurantSignupForm";
import de from "@/i18n/de";

// Das Markup liegt in components/RestaurantSignupForm.js und wird mit den
// uebersetzten Fassungen unter (intl)/[locale]/ geteilt.
export default function FreeTierPage() {
  return <RestaurantSignupForm t={de.signup} locale="de" />;
}
