"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* Unternehmer-Bestätigung + Widerrufs-Zustimmung — Pflicht vor jedem Abo-Checkout */
function LegalConsentCheckbox({ checked, onCheckedChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5 shrink-0" />
      <span className="text-xs text-gray-600 leading-relaxed">
        Ich bestätige, dass ich als <strong>Unternehmer/Gewerbetreibender</strong> handle. Ich verlange ausdrücklich, dass die Leistung sofort beginnt, und nehme zur Kenntnis, dass ein etwaiges Widerrufsrecht mit vollständiger Vertragserfüllung erlischt. Es gelten die{" "}
        <Link href="/AGBs" target="_blank" className="text-red-700 underline hover:text-red-800">AGB</Link> und die{" "}
        <Link href="/Widerruf" target="_blank" className="text-red-700 underline hover:text-red-800">Widerrufsbelehrung</Link>. <span className="text-red-500">*</span>
      </span>
    </label>
  );
}

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPendingPro, startProTransition] = useTransition();
  const [isPendingPremium, startPremiumTransition] = useTransition();
  const [isPendingPortal, startPortalTransition] = useTransition();
  const [error, setError] = useState("");

  const isSubscribed = session?.user?.subscriptionStatus === "active";
  const currentSub = session?.user?.subscription;

  const handlePortal = () => {
    startPortalTransition(async () => {
      const res = await fetch("/api/payment/portal", { method: "POST" });
      if (!res.ok) {
        setError("Stripe-Portal konnte nicht geöffnet werden");
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

  if (status === "loading") return <p>Loading...</p>;

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
        setError("No checkout URL received");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Checkout failed");
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
    startPremiumTransition(() => handleCheckout("premium"));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-red-700 uppercase tracking-widest text-xs font-semibold mb-3">Preise</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Wähle deinen Tarif</h1>
          <p className="text-gray-500 max-w-md mx-auto">Starte kostenlos und wechsle jederzeit. Keine versteckten Kosten.</p>
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
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Kostenlos</p>
              <CardTitle className="text-2xl font-bold">Free</CardTitle>
              <CardDescription>Perfekt zum Ausprobieren</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">€0</span>
                <span className="text-gray-400 ml-1">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {["1 Restaurant", "Digitale Speisekarte", "50 Gerichte Limit", "QR-Code Generator"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full border-gray-300 hover:border-red-400 hover:text-red-700" onClick={() => router.push("/ErstelleRestaurantAccount/FreeTier")}>
                Jetzt starten
              </Button>
            </CardContent>
          </Card>

          {/* Pro Tier — hervorgehoben */}
          <Card className="border-2 border-red-800 bg-white hover:shadow-2xl transition-all duration-300 relative scale-105 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-800 text-white px-5 py-1 rounded-full text-xs font-bold tracking-wide shadow">⭐ Empfohlen</div>
            <CardHeader className="pb-2 pt-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-700 mb-1">Beliebteste Wahl</p>
              <CardTitle className="text-2xl font-bold">Pro</CardTitle>
              <CardDescription>Unbegrenzte Möglichkeiten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold text-red-800">€14.99</span>
                <span className="text-gray-400 ml-1">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {["Bis zu 25 Kategorien", "Bis zu 200 Gerichte", "Premium Farben & Fonts", "Management-System", "Gerichtverfügbarkeitsanzeige"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {isSubscribed ? (
                currentSub === "Professional" ? (
                  <Button disabled className="w-full">
                    Aktiver Plan ✓
                  </Button>
                ) : (
                  <Button size="lg" className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold shadow" onClick={handlePortal} disabled={isPendingPortal}>
                    {isPendingPortal ? "Weiterleiten..." : "Zu diesem Plan wechseln"}
                  </Button>
                )
              ) : (
                <Dialog open={showProForm} onOpenChange={setShowProForm}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold shadow">
                      Jetzt Pro abonnieren
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Restaurant Details für Pro (€14.99/Monat)</DialogTitle>
                      <DialogDescription>Nach Zahlung wird dein Restaurant automatisch erstellt.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProSubmit} className="space-y-4 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Restaurant Name *</Label>
                          <Input required value={restaurantData.restaurantName} onChange={(e) => updateRestaurantData("restaurantName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Kategorie *</Label>
                          <Select value={restaurantData.category} onValueChange={(v) => updateRestaurantData("category", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Wähle Kategorie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Italian">Italienisch</SelectItem>
                              <SelectItem value="German">Deutsch</SelectItem>
                              <SelectItem value="Asian">Asiatisch</SelectItem>
                              <SelectItem value="FastFood">Fast Food</SelectItem>
                              <SelectItem value="Other">Anderes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>E-Mail *</Label>
                        <Input type="email" required value={restaurantData.email} onChange={(e) => updateRestaurantData("email", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefon *</Label>
                        <Input required value={restaurantData.phone} onChange={(e) => updateRestaurantData("phone", e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Straße *</Label>
                          <Input required value={restaurantData.street} onChange={(e) => updateRestaurantData("street", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Hausnummer *</Label>
                          <Input required value={restaurantData.houseNumber} onChange={(e) => updateRestaurantData("houseNumber", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>PLZ *</Label>
                          <Input required value={restaurantData.postalCode} onChange={(e) => updateRestaurantData("postalCode", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Stadt *</Label>
                          <Input required value={restaurantData.city} onChange={(e) => updateRestaurantData("city", e.target.value)} />
                        </div>
                      </div>
                      <LegalConsentCheckbox checked={legalConsent} onCheckedChange={setLegalConsent} />
                      <div className="pt-4 space-x-2 flex justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowProForm(false)}>
                          Abbrechen
                        </Button>
                        <Button type="submit" disabled={isPendingPro || !legalConsent}>
                          {isPendingPro ? "Verarbeite..." : "Mit Stripe bezahlen"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border border-gray-200 bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Enterprise</p>
              <CardTitle className="text-2xl font-bold">Premium</CardTitle>
              <CardDescription>Maximale Features & Support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">€7.99</span>
                <span className="text-gray-400 ml-1">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {["Bis zu 15 Kategorien", "Bis zu 100 Gerichte", "Basic Templates", "QR-Code"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {isSubscribed ? (
                currentSub === "Business" ? (
                  <Button disabled className="w-full">
                    Aktiver Plan ✓
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400" onClick={handlePortal} disabled={isPendingPortal}>
                    {isPendingPortal ? "Weiterleiten..." : "Zu diesem Plan wechseln"}
                  </Button>
                )
              ) : (
                <Dialog open={showPremiumForm} onOpenChange={setShowPremiumForm}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400">
                      Jetzt Premium abonnieren
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Restaurant Details für Premium (€7.99/Monat)</DialogTitle>
                      <DialogDescription>Nach Zahlung wird dein Restaurant automatisch erstellt.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePremiumSubmit} className="space-y-4 overflow-y-auto">
                      {/* Same form as Pro */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Restaurant Name *</Label>
                          <Input required value={restaurantData.restaurantName} onChange={(e) => updateRestaurantData("restaurantName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Kategorie *</Label>
                          <Select value={restaurantData.category} onValueChange={(v) => updateRestaurantData("category", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Wähle Kategorie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Italian">Italienisch</SelectItem>
                              <SelectItem value="German">Deutsch</SelectItem>
                              <SelectItem value="Asian">Asiatisch</SelectItem>
                              <SelectItem value="FastFood">Fast Food</SelectItem>
                              <SelectItem value="Other">Anderes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>E-Mail *</Label>
                        <Input type="email" required value={restaurantData.email} onChange={(e) => updateRestaurantData("email", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefon *</Label>
                        <Input required value={restaurantData.phone} onChange={(e) => updateRestaurantData("phone", e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Straße *</Label>
                          <Input required value={restaurantData.street} onChange={(e) => updateRestaurantData("street", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Hausnummer *</Label>
                          <Input required value={restaurantData.houseNumber} onChange={(e) => updateRestaurantData("houseNumber", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>PLZ *</Label>
                          <Input required value={restaurantData.postalCode} onChange={(e) => updateRestaurantData("postalCode", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Stadt *</Label>
                          <Input required value={restaurantData.city} onChange={(e) => updateRestaurantData("city", e.target.value)} />
                        </div>
                      </div>
                      <LegalConsentCheckbox checked={legalConsent} onCheckedChange={setLegalConsent} />
                      <div className="pt-4 space-x-2 flex justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowPremiumForm(false)}>
                          Abbrechen
                        </Button>
                        <Button type="submit" disabled={isPendingPremium || !legalConsent}>
                          {isPendingPremium ? "Verarbeite..." : "Mit Stripe bezahlen"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

        {session && (
          <div className="mt-16 text-center">
            <p>
              Aktueller Tarif: <span className="font-semibold">{session.user.subscription || "Free"}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
