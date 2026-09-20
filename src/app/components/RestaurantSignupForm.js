"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { hasEqualOrHigherTier } from "@/lib/tierRank";
import { createRegistrationSchema, SUPPORTED_COUNTRIES } from "@/lib/schemas/restaurant";
import { getCategoryOptions } from "@/i18n/categories";
import { localizedPath } from "@/i18n/config";
import { isTierAvailableUI } from "@/lib/tierAvailability";

// Geteiltes Registrierungsformular fuer alle Sprachen.
//
// Die Rechtsseiten (/AGBs, /Widerruf) bleiben bewusst ohne Sprach-Praefix:
// es sind deutschsprachige Dokumente nach deutschem Recht. In den uebersetzten
// Fassungen steht die Zustimmung uebersetzt da, damit der Nutzer versteht, was
// er bestaetigt — mit ausdruecklichem Hinweis, dass die deutsche Fassung die
// verbindliche ist (t.consent.bindingNote).

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

// Auf Modulebene definiert, nicht innerhalb der Formular-Komponente: eine dort
// deklarierte Komponente ist bei jedem Render ein neuer Typ, React wirft das
// <input> weg und baut es neu auf — der Fokus geht dabei nach jedem Zeichen
// verloren.
function Field({ name, label, type = "text", hint, value, error, onChange, className }) {
  return (
    <div>
      <label className="block font-medium mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <input name={name} type={type} value={value} onChange={onChange} className={className} />
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default function RestaurantSignupForm({ t, locale }) {
  const schema = useMemo(() => createRegistrationSchema(t.validation), [t]);
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
    // Vorbelegung passend zur Sprache: wer die englische Fassung aufruft, sitzt
    // meist nicht in Deutschland. Aendern kann es der Nutzer ohnehin.
    country: locale === "de" ? "DE" : "",
    phone: "",
    website: "",
    category: "",
    description: "",
    openingHours: "",
    ownerID: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isBusinessConfirmed, setIsBusinessConfirmed] = useState(false);
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);

  const { data: session, status, update } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (isAuthenticated && session?.user?.id) {
      setRestaurant((prev) => ({ ...prev, ownerID: session.user.id }));
    }
  }, [isAuthenticated, session?.user?.id]);

  if (status === "loading") {
    return <div>{t.loading}</div>;
  }

  if (hasEqualOrHigherTier(session?.user?.subscription, "FreeTier")) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full border-amber-100 shadow-xl text-center">
          <CardContent className="p-10">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">{t.alreadySubscribed.title}</h1>
            <p className="text-gray-500">{t.alreadySubscribed.text}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const setField = (name, value) => {
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

  const handleChange = (e) => setField(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);

    try {
      schema.parse(restaurant);

      const res = await fetch("/api/restaurant/requestRegister/FreeTier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurant),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || t.saveError);
      }

      setSuccess(true);
      window.alert(t.successAlert);

      // JWT auffrischen (role → Owner, subscription → FreeTier) und ins Profil weiterleiten
      await update();
      router.push(`/Profil?userID=${session.user.id}`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(err.message);
      }
    }
  };

  const inputStyle = (field) => `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors[field] ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`;

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-16 px-4">
      <Card className="max-w-3xl mx-auto border-amber-100 shadow-xl">
        <CardContent className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-4 shadow">{t.badge}</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">{t.title}</h1>
            <p className="text-gray-500 max-w-md mx-auto">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Field name="ownerName" label={t.fields.ownerName} value={restaurant.ownerName} error={errors.ownerName} onChange={handleChange} className={inputStyle("ownerName")} />
            <Field name="restaurantName" label={t.fields.restaurantName} value={restaurant.restaurantName} error={errors.restaurantName} onChange={handleChange} className={inputStyle("restaurantName")} />
            <Field name="email" label={t.fields.email} type="email" value={restaurant.email} error={errors.email} onChange={handleChange} className={inputStyle("email")} />

            <div className="grid grid-cols-2 gap-4">
              <Field name="postalCode" label={t.fields.postalCode} value={restaurant.postalCode} error={errors.postalCode} onChange={handleChange} className={inputStyle("postalCode")} />
              <Field name="city" label={t.fields.city} value={restaurant.city} error={errors.city} onChange={handleChange} className={inputStyle("city")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field name="street" label={t.fields.street} value={restaurant.street} error={errors.street} onChange={handleChange} className={inputStyle("street")} />
              <Field name="houseNumber" label={t.fields.houseNumber} value={restaurant.houseNumber} error={errors.houseNumber} onChange={handleChange} className={inputStyle("houseNumber")} />
            </div>

            <div>
              <label className="block font-medium mb-1">
                {t.fields.country} <span className="text-red-500">*</span>
              </label>
              <select name="country" value={restaurant.country} onChange={handleChange} className={inputStyle("country")}>
                <option value="">{t.fields.categoryPlaceholder}</option>
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              {!errors.country && <p className="text-xs text-gray-500 mt-1">{t.fields.countryHint}</p>}
              {errors.country && <p className="text-red-500">{errors.country}</p>}
            </div>

            <Field name="phone" label={t.fields.phone} type="tel" hint={t.fields.phoneHint} value={restaurant.phone} error={errors.phone} onChange={handleChange} className={inputStyle("phone")} />

            <div>
              <label className="block font-medium mb-1">{t.fields.website}</label>
              <input name="website" value={restaurant.website} onChange={handleChange} className={inputStyle("website")} />
              {errors.website && <p className="text-red-500">{errors.website}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">
                {t.fields.category} <span className="text-red-500">*</span>
              </label>
              <select name="category" value={restaurant.category} onChange={handleChange} className={inputStyle("category")}>
                <option value="">{t.fields.categoryPlaceholder}</option>
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">{t.fields.description}</label>
              <textarea name="description" maxLength={300} value={restaurant.description} onChange={handleChange} className={inputStyle("description")} />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>

            {submitError && <p className="text-red-500 font-medium">{submitError}</p>}
            {success && <p className="text-green-600 font-medium">{t.successInline}</p>}

            {/* Unternehmer-Bestätigung */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={isBusinessConfirmed} onChange={(e) => setIsBusinessConfirmed(e.target.checked)} className="mt-1 w-4 h-4 accent-emerald-600 shrink-0" />
              <span className="text-sm text-gray-600">
                {t.consent.business} <span className="text-red-500">*</span>
              </span>
            </label>

            <div className="space-y-3">
              {isAuthenticated ? (
                success ? (
                  <></>
                ) : (
                  <>
                    <button type="submit" disabled={!isBusinessConfirmed} className={`w-full font-semibold py-3 rounded-lg transition-all ${isBusinessConfirmed ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                      {t.submit}
                    </button>

                    {/* Pro-Upgrade nur zeigen, wenn der Tarif auch buchbar ist.
                        Vorher stand hier ein Button mit festem Preis fuer einen
                        Tarif, den der Server mit 403 ablehnt — der Nutzer bekam
                        nach dem Klick eine Fehlermeldung statt eines Checkouts. */}
                    {isTierAvailableUI("Professional") && (
                    <div className="space-y-3">
                      {/* Widerrufs-Zustimmung — Pflicht vor kostenpflichtigem Checkout */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={withdrawalConsent} onChange={(e) => setWithdrawalConsent(e.target.checked)} className="mt-1 w-4 h-4 accent-indigo-600 shrink-0" />
                        <span className="text-sm text-gray-600">
                          {t.consent.withdrawalPrefix}{" "}
                          <a href={localizedPath("/AGBs", "de")} target="_blank" rel="noreferrer" className="text-indigo-600 underline hover:text-indigo-800">
                            {t.consent.terms}
                          </a>{" "}
                          {t.consent.and}{" "}
                          <a href={localizedPath("/Widerruf", "de")} target="_blank" rel="noreferrer" className="text-indigo-600 underline hover:text-indigo-800">
                            {t.consent.withdrawal}
                          </a>
                          .
                          {t.consent.bindingNote && <em className="block mt-1 text-xs text-gray-500 not-italic">{t.consent.bindingNote}</em>}
                        </span>
                      </label>
                      <button
                        type="button"
                        disabled={!isBusinessConfirmed || !withdrawalConsent}
                        onClick={async () => {
                          const res = await fetch("/api/payment/checkout", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ tier: "pro", withdrawalConsent }),
                          });
                          const { url } = await res.json();
                          if (url) window.location.href = url;
                        }}
                        className={`w-full font-semibold py-3 rounded-lg transition-all ${isBusinessConfirmed && withdrawalConsent ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                      >
                        {t.proUpgrade}
                      </button>
                    </div>
                    )}
                  </>
                )
              ) : (
                <div>{t.signInFirst}</div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
