"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [showProForm, setShowProForm] = useState(false);
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
    const res = await fetch("/api/payment/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier, restaurant: restaurantData }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  const handleProClick = () => {
    setShowProForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleCheckout("pro");
  };

  const updateRestaurantData = (field, value) => {
    setRestaurantData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Wähle deinen Tarif</h1>
        
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
                <li>✗ Keine Premium Farben</li>
              </ul>
              <Button variant="outline" asChild className="w-full" onClick={() => router.push("/ErstelleRestaurantAccount/FreeTier")}>
                Jetzt starten
              </Button>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Empfohlen</div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>Unbegrenzte Möglichkeiten</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">€19<small className="text-lg">/Monat</small></div>
              <ul className="text-left space-y-2 mb-8">
                <li>✓ Unbegrenzte Gerichte</li>
                <li>✓ Premium Farben</li>
                <li>✓ Mehreren Standorte</li>
                <li>✓ Priorisierter Support</li>
              </ul>
              <Dialog open={showProForm} onOpenChange={setShowProForm}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600" onClick={handleProClick}>
                    Jetzt Pro abonnieren
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Restaurant Details für Pro Tarif</DialogTitle>
                    <DialogDescription>
                      Gib die Daten deines Restaurants ein. Nach erfolgreicher Zahlung wird eine Registrierungsanfrage erstellt.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="restaurantName">Restaurant Name</Label>
                        <Input id="restaurantName" value={restaurantData.restaurantName} onChange={(e) => updateRestaurantData("restaurantName", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Kategorie</Label>
                        <Select value={restaurantData.category} onValueChange={(value) => updateRestaurantData("category", value)}>
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
                      <Label htmlFor="email">E-Mail</Label>
                      <Input id="email" type="email" value={restaurantData.email} onChange={(e) => updateRestaurantData("email", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" value={restaurantData.phone} onChange={(e) => updateRestaurantData("phone", e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Straße</Label>
                        <Input id="street" value={restaurantData.street} onChange={(e) => updateRestaurantData("street", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="houseNumber">Hausnummer</Label>
                        <Input id="houseNumber" value={restaurantData.houseNumber} onChange={(e) => updateRestaurantData("houseNumber", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">PLZ</Label>
                        <Input id="postalCode" value={restaurantData.postalCode} onChange={(e) => updateRestaurantData("postalCode", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Stadt</Label>
                        <Input id="city" value={restaurantData.city} onChange={(e) => updateRestaurantData("city", e.target.value)} required />
                      </div>
                    </div>
                    <div className="pt-4 space-x-2 flex justify-end">
                      <Button type="button" variant="outline" onClick={() => setShowProForm(false)}>
                        Abbrechen
                      </Button>
                      <Button type="submit">
                        Mit Stripe bezahlen (€19/Monat)
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
            <p>Aktueller Tarif: <span className="font-semibold">{session.user.subscription}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

