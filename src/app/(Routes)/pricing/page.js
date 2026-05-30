"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPendingPro, startProTransition] = useTransition();
  const [isPendingPremium, startPremiumTransition] = useTransition();
  const [error, setError] = useState('');

  const [showProForm, setShowProForm] = useState(false);
  const [showPremiumForm, setShowPremiumForm] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    restaurantName: '',
    email: '',
    phone: '',
    category: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'DE',
  });

  if (status === "loading") return <p>Loading...</p>;

  const handleCheckout = async (tier) => {
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, restaurant: restaurantData }),
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
    setRestaurantData(prev => ({ ...prev, [field]: value }));
  };

  const handleProSubmit = (e) => {
    e.preventDefault();
    startProTransition(() => handleCheckout('pro'));
  };

  const handlePremiumSubmit = (e) => {
    e.preventDefault();
    startPremiumTransition(() => handleCheckout('premium'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3">Preise</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">Wähle deinen Tarif</h1>
          <p className="text-gray-500 max-w-md mx-auto">Starte kostenlos und wechsle jederzeit. Keine versteckten Kosten.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError('')}>×</Button>
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
                {["1 Restaurant", "Digitale Speisekarte", "50 Gerichte Limit", "QR-Code Generator"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-gray-300 hover:border-amber-400 hover:text-amber-700"
                onClick={() => router.push("/(Routes)/ErstelleRestaurantAccount/FreeTier")}
              >
                Jetzt starten
              </Button>
            </CardContent>
          </Card>

          {/* Pro Tier — hervorgehoben */}
          <Card className="border-2 border-amber-500 bg-white hover:shadow-2xl transition-all duration-300 relative scale-105 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-1 rounded-full text-xs font-bold tracking-wide shadow">
              ⭐ Empfohlen
            </div>
            <CardHeader className="pb-2 pt-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">Beliebteste Wahl</p>
              <CardTitle className="text-2xl font-bold">Pro</CardTitle>
              <CardDescription>Unbegrenzte Möglichkeiten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold text-amber-600">€14.99</span>
                <span className="text-gray-400 ml-1">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {["Bis zu 25 Kategorien", "Bis zu 200 Gerichte", "Premium Farben & Fonts", "Mehrere Standorte"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Dialog open={showProForm} onOpenChange={setShowProForm}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow"
                  >
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
                        <Input 
                          required 
                          value={restaurantData.restaurantName} 
                          onChange={(e) => updateRestaurantData('restaurantName', e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Kategorie *</Label>
                        <Select value={restaurantData.category} onValueChange={(v) => updateRestaurantData('category', v)}>
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
                      <Input 
                        type="email" 
                        required 
                        value={restaurantData.email} 
                        onChange={(e) => updateRestaurantData('email', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon *</Label>
                      <Input 
                        required 
                        value={restaurantData.phone} 
                        onChange={(e) => updateRestaurantData('phone', e.target.value)} 
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Straße *</Label>
                        <Input required value={restaurantData.street} onChange={(e) => updateRestaurantData('street', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Hausnummer *</Label>
                        <Input required value={restaurantData.houseNumber} onChange={(e) => updateRestaurantData('houseNumber', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>PLZ *</Label>
                        <Input required value={restaurantData.postalCode} onChange={(e) => updateRestaurantData('postalCode', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Stadt *</Label>
                        <Input required value={restaurantData.city} onChange={(e) => updateRestaurantData('city', e.target.value)} />
                      </div>
                    </div>
                    <div className="pt-4 space-x-2 flex justify-end">
                      <Button type="button" variant="outline" onClick={() => setShowProForm(false)}>
                        Abbrechen
                      </Button>
                      <Button type="submit" disabled={isPendingPro}>
                        {isPendingPro ? "Verarbeite..." : "Mit Stripe bezahlen"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border border-orange-200 bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">Enterprise</p>
              <CardTitle className="text-2xl font-bold">Premium</CardTitle>
              <CardDescription>Maximale Features & Support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">€7.99</span>
                <span className="text-gray-400 ml-1">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {["Bis zu 15 Kategorien", "Bis zu 100 Gerichte", "24/7 Premium Support", "Marketing Tools", "Analytics Dashboard"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Dialog open={showPremiumForm} onOpenChange={setShowPremiumForm}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400">
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
                        <Input required value={restaurantData.restaurantName} onChange={(e) => updateRestaurantData('restaurantName', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Kategorie *</Label>
                        <Select value={restaurantData.category} onValueChange={(v) => updateRestaurantData('category', v)}>
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
                      <Input type="email" required value={restaurantData.email} onChange={(e) => updateRestaurantData('email', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon *</Label>
                      <Input required value={restaurantData.phone} onChange={(e) => updateRestaurantData('phone', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Straße *</Label>
                        <Input required value={restaurantData.street} onChange={(e) => updateRestaurantData('street', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Hausnummer *</Label>
                        <Input required value={restaurantData.houseNumber} onChange={(e) => updateRestaurantData('houseNumber', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>PLZ *</Label>
                        <Input required value={restaurantData.postalCode} onChange={(e) => updateRestaurantData('postalCode', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Stadt *</Label>
                        <Input required value={restaurantData.city} onChange={(e) => updateRestaurantData('city', e.target.value)} />
                      </div>
                    </div>
                    <div className="pt-4 space-x-2 flex justify-end">
                      <Button type="button" variant="outline" onClick={() => setShowPremiumForm(false)}>
                        Abbrechen
                      </Button>
                      <Button type="submit" disabled={isPendingPremium}>
                        {isPendingPremium ? "Verarbeite..." : "Mit Stripe bezahlen"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {session && (
          <div className="mt-16 text-center">
            <p>Aktueller Tarif: <span className="font-semibold">{session.user.subscription || 'Free'}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
