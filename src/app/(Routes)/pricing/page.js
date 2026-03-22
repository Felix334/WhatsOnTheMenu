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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Wähle deinen Tarif</h1>
        
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error} 
            <Button variant="ghost" size="sm" onClick={() => setError('')} className="ml-2">×</Button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <Card className="border-2 border-gray-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfekt zum Starten</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-4">€0</div>
              <ul className="text-left space-y-2 mb-8">
                <li>✓ 1 Restaurant</li>
                <li>✓ Basis Features</li>
                <li>✓ 50 Gerichte Limit</li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => router.push("/(Routes)/ErstelleRestaurantAccount/FreeTier")}
              >
                Jetzt starten
              </Button>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all relative md:col-span-1">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Empfohlen</div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>Unbegrenzte Möglichkeiten</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">
                €19<small className="text-lg">/Monat</small>
              </div>
              <ul className="text-left space-y-2 mb-8">
                <li>✓ Unbegrenzte Gerichte</li>
                <li>✓ Premium Farben</li>
                <li>✓ Mehreren Standorte</li>
                <li>✓ Priorisierter Support</li>
              </ul>
              <Dialog open={showProForm} onOpenChange={setShowProForm}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    Jetzt Pro abonnieren
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Restaurant Details für Pro (€19/Monat)</DialogTitle>
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
          <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>Maximale Features</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-4">€14.99<small className="text-lg">/Monat</small></div>
              <ul className="text-left space-y-2 mb-8">
                <li>✓ Alles aus Pro +</li>
                <li>✓ 24/7 Premium Support</li>
                <li>✓ Marketing Tools</li>
                <li>✓ Analytics</li>
              </ul>
              <Dialog open={showPremiumForm} onOpenChange={setShowPremiumForm}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Jetzt Premium abonnieren
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Restaurant Details für Premium (€14.99/Monat)</DialogTitle>
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
