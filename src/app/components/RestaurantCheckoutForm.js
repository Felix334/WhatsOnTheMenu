"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createRegistrationSchema, SUPPORTED_COUNTRIES } from "@/lib/schemas/restaurant";
import { getCategoryOptions } from "@/i18n/categories";

// Business-Registrierung: fuellt das Formular und geht direkt in den
// Stripe-Checkout — im Unterschied zu RestaurantSignupForm, das ein
// FreeTier-Konto anlegt.
//
// Bewusst NICHT mit dem FreeTier-Formular zu einer Komponente verschmolzen,
// obwohl die Felder dieselben sind: hier haengt eine Zahlung dran. Zwei
// getrennte, je fuer sich lesbare Abläufe sind mir an dieser Stelle lieber als
// eine Komponente mit einem `variant`-Schalter, bei der eine Aenderung am
// kostenlosen Pfad versehentlich den Bezahlpfad trifft.

function useCountryOptions(locale) {
  return useMemo(() => {
    let naming;
    try {
      naming = new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      naming = null;
    }
    return SUPPORTED_COUNTRIES.map((code) => ({
      code,
      label: naming ? naming.of(code) || code : code,
    })).sort((a, b) => a.label.localeCompare(b.label, locale));
  }, [locale]);
}

function Field({ name, label, type = "text", value, error, onChange, hint }) {
  const className = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`;
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1" htmlFor={name}>
        {label} <span className="text-red-500">*</span>
      </label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} className={className} />
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function RestaurantCheckoutForm({ t, tShared, locale }) {
  // Dasselbe Schema wie die FreeTier-Strecke, nur ohne ownerID (den setzt hier
  // niemand — der Vertrag laeuft ueber die Stripe-Session).
  const schema = useMemo(() => createRegistrationSchema(tShared.validation).omit({ ownerID: true }), [tShared]);
  const categoryOptions = useMemo(() => getCategoryOptions(locale), [locale]);
  const countryOptions = useCountryOptions(locale);

  const [restaurant, setRestaurant] = useState({
    ownerName: "",
    restaurantName: "",
    email: "",
    postalCode: "",
    city: "",
    street: "",
    houseNumber: "",
    country: locale === "de" ? "DE" : "",
    phone: "",
    website: "",
    category: "",
    description: "",
    openingHours: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isBusinessConfirmed, setIsBusinessConfirmed] = useState(false);
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
    try {
      schema.pick({ [name]: true }).parse({ [name]: value });
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: err.errors[0].message }));
      }
    }
  };

  const isFormValid = () => schema.safeParse(restaurant).success;

  const handleBusinessCheckout = async () => {
    setSubmitError(null);
    try {
      const { ownerName, restaurantName, category, street, houseNumber, postalCode, city, country } = restaurant;
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: "Business",
          // `country` ist neu im Payload — ohne das landete jedes Restaurant
          // als deutsches in der Datenbank (siehe restaurantCheckoutSchema).
          restaurant: { ownerName, restaurantName, category, street, houseNumber, postalCode, city, country },
          withdrawalConsent,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || t.checkoutError);
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      setSubmitError(err.message || t.checkoutStartError);
    }
  };

  const selectStyle = (field) => `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors[field] ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`;

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-16 px-4">
      <Card className="max-w-3xl mx-auto border-amber-100 shadow-xl">
        <CardContent className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-4 shadow">{t.badge}</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">{t.title}</h1>
            <p className="text-gray-500 max-w-md mx-auto">{t.subtitle}</p>
          </div>

          <form className="space-y-6">
            <Field name="ownerName" label={t.ownerName} value={restaurant.ownerName} error={errors.ownerName} onChange={handleChange} />
            <Field name="restaurantName" label={t.restaurantName} value={restaurant.restaurantName} error={errors.restaurantName} onChange={handleChange} />
            <Field name="description" label={t.shortDescription} value={restaurant.description} error={errors.description} onChange={handleChange} />
            <Field name="email" label={tShared.fields.email} type="email" value={restaurant.email} error={errors.email} onChange={handleChange} />

            <div className="grid grid-cols-2 gap-4">
              <Field name="postalCode" label={tShared.fields.postalCode} value={restaurant.postalCode} error={errors.postalCode} onChange={handleChange} />
              <Field name="city" label={tShared.fields.city} value={restaurant.city} error={errors.city} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field name="street" label={tShared.fields.street} value={restaurant.street} error={errors.street} onChange={handleChange} />
              <Field name="houseNumber" label={tShared.fields.houseNumber} value={restaurant.houseNumber} error={errors.houseNumber} onChange={handleChange} />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1" htmlFor="country">
                {tShared.fields.country} <span className="text-red-500">*</span>
              </label>
              <select id="country" name="country" value={restaurant.country} onChange={handleChange} className={selectStyle("country")}>
                <option value="">{tShared.fields.categoryPlaceholder}</option>
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              {!errors.country && <p className="text-xs text-gray-500 mt-1">{tShared.fields.countryHint}</p>}
              {errors.country && <p className="text-red-500 mt-1">{errors.country}</p>}
            </div>

            <Field name="phone" label={tShared.fields.phone} type="tel" value={restaurant.phone} error={errors.phone} onChange={handleChange} hint={tShared.fields.phoneHint} />

            <div>
              <label className="block font-medium text-gray-700 mb-1" htmlFor="website">
                {tShared.fields.website}
              </label>
              <input id="website" name="website" value={restaurant.website} onChange={handleChange} className={selectStyle("website")} />
              {errors.website && <p className="text-red-500 mt-1">{errors.website}</p>}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1" htmlFor="category">
                {tShared.fields.category} <span className="text-red-500">*</span>
              </label>
              <select id="category" name="category" value={restaurant.category} onChange={handleChange} className={selectStyle("category")}>
                <option value="">{tShared.fields.categoryPlaceholder}</option>
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 mt-1">{errors.category}</p>}
            </div>

            {/* Statusmeldungen */}
            {submitError && <p className="text-red-500 font-medium">{submitError}</p>}

            {/* Unternehmer-Bestätigung */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={isBusinessConfirmed} onChange={(e) => setIsBusinessConfirmed(e.target.checked)} className="mt-1 w-4 h-4 accent-indigo-600 shrink-0" />
              <span className="text-sm text-gray-600">
                {t.businessConsent} <span className="text-red-500">*</span>
              </span>
            </label>

            {/* Widerrufs-Zustimmung (Pflicht vor Abo-Checkout) */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={withdrawalConsent} onChange={(e) => setWithdrawalConsent(e.target.checked)} className="mt-1 w-4 h-4 accent-indigo-600 shrink-0" />
              <span className="text-sm text-gray-600">
                {t.withdrawalPrefix}{" "}
                <a href="/AGBs" target="_blank" rel="noreferrer" className="text-indigo-600 underline hover:text-indigo-800">
                  {tShared.consent.terms}
                </a>{" "}
                {tShared.consent.and}{" "}
                <a href="/Widerruf" target="_blank" rel="noreferrer" className="text-indigo-600 underline hover:text-indigo-800">
                  {tShared.consent.withdrawal}
                </a>
                . <span className="text-red-500">*</span>
                {t.bindingNote && <em className="block mt-1 text-xs text-gray-500 not-italic">{t.bindingNote}</em>}
              </span>
            </label>

            {/* Buttons */}
            <div className="pt-4">
              <Button
                type="button"
                onClick={handleBusinessCheckout}
                disabled={!isFormValid() || !isBusinessConfirmed || !withdrawalConsent}
                className={`w-full font-semibold py-3 rounded-xl shadow-xl text-lg transition-all
    ${isFormValid() && isBusinessConfirmed && withdrawalConsent ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                {t.submit}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
