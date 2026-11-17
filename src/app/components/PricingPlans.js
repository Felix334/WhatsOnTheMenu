"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hasEqualOrHigherTier } from "@/lib/tierRank";
import { SUPPORTED_COUNTRIES } from "@/lib/schemas/restaurant";
import { isTierAvailableUI } from "@/lib/tierAvailability";
import { TIER_LABELS, tierLabel } from "@/lib/tierLabels";
import { getCategoryOptions } from "@/i18n/categories";
import { localizedPath } from "@/i18n/config";

// Tarifseite mit Checkout — fuer alle Sprachen dieselbe Komponente, gerendert
// von src/app/(intl)/[locale]/pricing/page.js. Texte kommen aus dem
// Woerterbuch (pricingPage, signup.fields, home.pricing).
//
// Anzeige-Schalter pro Tarif. Die Liste steht zentral in
// src/lib/tierAvailability.js, damit Registrierungsformular und Tarifseite
// nicht auseinanderlaufen. Verbindlich bleibt AVAILABLE_TIERS in
// src/lib/stripe.ts, serverseitig erzwungen in api/payment/checkout.
const TIER_AVAILABLE_UI = {
  Professional: isTierAvailableUI("Professional"),
  Business: isTierAvailableUI("Business"),
};

// Ländernamen nicht hart hinterlegen, sondern vom Browser benennen lassen:
// Intl.DisplayNames liefert sie in der jeweiligen Sprache.
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

const fill = (template, plan) => template.replace("{plan}", plan);

/* Unternehmer-Bestätigung + Widerrufs-Zustimmung — Pflicht vor jedem Abo-Checkout.
   AGB und Widerrufsbelehrung gibt es nur auf Deutsch (deutsches Recht); die
   englische Fassung weist per bindingNote darauf hin. */
function LegalConsentCheckbox({ t, checked, onCheckedChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5 shrink-0" />
      <span className="text-xs text-gray-600 leading-relaxed">
        {t.before}
        <strong>{t.strong}</strong>
        {t.after}{" "}
        <Link href="/AGBs" target="_blank" hrefLang="de" className="text-red-700 underline hover:text-red-800">
          {t.terms}
        </Link>{" "}
        {t.and}{" "}
        <Link href="/Widerruf" target="_blank" hrefLang="de" className="text-red-700 underline hover:text-red-800">
          {t.withdrawal}
        </Link>
        . <span className="text-red-500">*</span>
        {t.bindingNote && <span className="block mt-1 text-gray-500">{t.bindingNote}</span>}
      </span>
    </label>
  );
}

/* Restaurant-Angaben vor dem Checkout — ein Formular fuer beide Bezahl-Tarife. */
function CheckoutDialog({ t, fields, locale, open, onOpenChange, trigger, title, restaurantData, onChange, legalConsent, onConsentChange, onSubmit, pending }) {
  const countryOptions = useCountryOptions(locale);
  const categoryOptions = useMemo(() => getCategoryOptions(locale), [locale]);

  const textField = (name, label, props = {}) => (
    <div className="space-y-2">
      <Label htmlFor={`checkout-${name}`}>{label} *</Label>
      <Input id={`checkout-${name}`} required value={restaurantData[name]} onChange={(e) => onChange(name, e.target.value)} {...props} />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{t.dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {textField("restaurantName", fields.restaurantName)}
            <div className="space-y-2">
              <Label>{fields.category} *</Label>
              <Select value={restaurantData.category} onValueChange={(v) => onChange("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder={fields.categoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {textField("email", fields.email, { type: "email" })}
          {textField("phone", fields.phone)}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {textField("street", fields.street)}
            {textField("houseNumber", fields.houseNumber)}
            {textField("postalCode", fields.postalCode)}
            {textField("city", fields.city)}
          </div>
          <div className="space-y-2">
            <Label>{fields.country} *</Label>
            <Select value={restaurantData.country} onValueChange={(value) => onChange("country", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">{t.countryHint}</p>
          </div>
          <LegalConsentCheckbox t={t.consent} checked={legalConsent} onCheckedChange={onConsentChange} />
          <div className="pt-4 space-x-2 flex justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={pending || !legalConsent}>
              {pending ? t.processing : t.pay}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FeatureList({ features, dotClass }) {
  return (
    <ul className="space-y-3 mb-8 text-sm text-gray-600">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-full ${dotClass} flex items-center justify-center text-[10px] font-bold shrink-0`}>✓</span>
          {f}
        </li>
      ))}
    </ul>
  );
}

export default function PricingPlans({ t, fields, plans, locale }) {
  const { data: session, status } = useSession();
  const [isPendingPro, startProTransition] = useTransition();
  const [isPendingPremium, startPremiumTransition] = useTransition();
  const [isPendingPortal, startPortalTransition] = useTransition();
  const [error, setError] = useState("");

  // Kein "Loading..."-Platzhalter mehr: die Seite wird statisch vorgerendert,
  // und dabei ist die Session immer "loading". Frueher sah Google deshalb auf
  // /pricing nur "Loading...". Jetzt rendern die Karten sofort; nur die
  // sessionabhaengigen Buttons sind bis zum Laden gesperrt.
  const sessionLoading = status === "loading";
  const isSubscribed = session?.user?.subscriptionStatus === "active";
  const currentSub = session?.user?.subscription;

  const handlePortal = () => {
    startPortalTransition(async () => {
      const res = await fetch("/api/payment/portal", { method: "POST" });
      if (!res.ok) {
        setError(t.portalError);
        return;
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    });
  };

  const [showProForm, setShowProForm] = useState(false);
  const [showPremiumForm, setShowPremiumForm] = useState(false);
  const [legalConsent, setLegalConsent] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    restaurantName: "",
    email: "",
    phone: "",
    category: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "DE",
  });

  const handleCheckout = async (tier) => {
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, restaurant: restaurantData, withdrawalConsent: legalConsent }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(t.noCheckoutUrl);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error && err.message ? err.message : t.checkoutFailed);
    }
  };

  const updateRestaurantData = (field, value) => {
    setRestaurantData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProSubmit = (e) => {
    e.preventDefault();
    startProTransition(() => handleCheckout("pro"));
  };

  const handlePremiumSubmit = (e) => {
    e.preventDefault();
    startPremiumTransition(() => handleCheckout("Business"));
  };

  const dialogProps = {
    t,
    fields,
    locale,
    restaurantData,
    onChange: updateRestaurantData,
    legalConsent,
    onConsentChange: setLegalConsent,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-red-700 uppercase tracking-widest text-xs font-semibold mb-3">{t.eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-gray-500 max-w-md mx-auto">{t.subtitle}</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError("")}>
              ×
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Free Tier */}
          <Card className="border border-gray-200 bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{t.free.eyebrow}</p>
              <CardTitle className="text-2xl font-bold">{TIER_LABELS.FreeTier}</CardTitle>
              <CardDescription>{t.free.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">{t.free.price}</span>
                <span className="text-gray-400 ml-1">{plans.perMonth}</span>
              </div>
              <FeatureList features={plans.starter.features} dotClass="bg-gray-100 text-gray-500" />
              {hasEqualOrHigherTier(currentSub, "FreeTier") ? (
                <Button variant="outline" disabled className="w-full">
                  {t.alreadyActive}
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full border-gray-300 hover:border-red-400 hover:text-red-700">
                  <Link href={localizedPath("/ErstelleRestaurantAccount/FreeTier", locale)}>{t.start}</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Premium (Professional) — hervorgehoben */}
          <Card className="border-2 border-red-800 bg-white hover:shadow-2xl transition-all duration-300 relative scale-105 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-800 text-white px-5 py-1 rounded-full text-xs font-bold tracking-wide shadow">{t.professional.badge}</div>
            <CardHeader className="pb-2 pt-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-700 mb-1">{t.professional.eyebrow}</p>
              <CardTitle className="text-2xl font-bold">{TIER_LABELS.Professional}</CardTitle>
              <CardDescription>{t.professional.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                {TIER_AVAILABLE_UI.Professional ? (
                  <>
                    <span className="text-5xl font-bold text-red-800">€</span>
                    <span className="text-gray-400 ml-1">{plans.perMonth}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-400">{t.comingSoon}</span>
                )}
              </div>
              <FeatureList features={plans.professional.features} dotClass="bg-red-100 text-red-700" />
              {isSubscribed && currentSub === "Professional" ? (
                <Button disabled className="w-full">
                  {t.activePlan}
                </Button>
              ) : !TIER_AVAILABLE_UI.Professional ? (
                <Button size="lg" disabled className="w-full bg-yellow-400 text-gray-900 font-semibold shadow">
                  {t.comingSoon}
                </Button>
              ) : isSubscribed ? (
                <Button size="lg" className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold shadow" onClick={handlePortal} disabled={isPendingPortal}>
                  {isPendingPortal ? t.redirecting : t.switchPlan}
                </Button>
              ) : (
                <CheckoutDialog
                  {...dialogProps}
                  open={showProForm}
                  onOpenChange={setShowProForm}
                  title={fill(t.dialogTitle, TIER_LABELS.Professional)}
                  onSubmit={handleProSubmit}
                  pending={isPendingPro}
                  trigger={
                    <Button size="lg" disabled={sessionLoading} className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold shadow">
                      {fill(t.subscribe, TIER_LABELS.Professional)}
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>

          {/* Plus (Business) */}
          <Card className="border border-gray-200 bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{t.business.eyebrow}</p>
              <CardTitle className="text-2xl font-bold">{TIER_LABELS.Business}</CardTitle>
              <CardDescription>{t.business.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">{t.business.price}</span>
                <span className="text-gray-400 ml-1">{plans.perMonth}</span>
              </div>
              <FeatureList features={plans.business.features} dotClass="bg-red-100 text-red-700" />
              {isSubscribed && currentSub === "Business" ? (
                <Button disabled className="w-full">
                  {t.activePlan}
                </Button>
              ) : !TIER_AVAILABLE_UI.Business ? (
                <Button size="lg" disabled variant="outline" className="w-full border-red-300 text-red-700">
                  {t.comingSoon}
                </Button>
              ) : isSubscribed ? (
                <Button size="lg" variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400" onClick={handlePortal} disabled={isPendingPortal}>
                  {isPendingPortal ? t.redirecting : t.switchPlan}
                </Button>
              ) : (
                <CheckoutDialog
                  {...dialogProps}
                  open={showPremiumForm}
                  onOpenChange={setShowPremiumForm}
                  title={`${fill(t.dialogTitle, TIER_LABELS.Business)} (${t.business.price}${plans.perMonth})`}
                  onSubmit={handlePremiumSubmit}
                  pending={isPendingPremium}
                  trigger={
                    <Button size="lg" variant="outline" disabled={sessionLoading} className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400">
                      {fill(t.subscribe, TIER_LABELS.Business)}
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>

        {session && (
          <div className="mt-16 text-center">
            <p>
              {t.currentPlan} <span className="font-semibold">{tierLabel(session.user.subscription || "FreeTier")}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
