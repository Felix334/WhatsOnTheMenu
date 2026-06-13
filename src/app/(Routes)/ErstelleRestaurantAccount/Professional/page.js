"use client";

import { useEffect, useState, Suspense } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Zod Schema für das Restaurant
const restaurantSchema = z.object({
  ownerName: z.string().min(2, "Ein Name ist erforderlich"),
  restaurantName: z.string().min(2, "Ein Restaurantname ist erforderlich"),
  email: z.string().email("Ungültige Email"),
  postalCode: z.string().min(4, "PLZ zu kurz"),
  city: z.string().min(1, "Stadt erforderlich"),
  street: z.string().min(1, "Straße erforderlich"),
  houseNumber: z.string().min(1, "Hausnummer erforderlich"),
  phone: z
    .string()
    .min(7, "Die Telefonnummer zu kurz")
    .max(20, "Die Telefonnummer zu lang")
    .regex(/^\+?\d+$/, "Die Telefonnummer ungültig"),
  website: z.string().url("Die Website muss eine gültige URL sein").optional().or(z.literal("")),
  openingHours: z.string().optional(),
  category: z.string(),
  description: z.string().max(300, "Maximal 2-3 Sätze (höchstens 300 Zeichen)").optional(),
});

// Vollständiges Registrierungsformular – aktuell NICHT aktiv (Professional gesperrt,
// siehe Page() unten). Bleibt erhalten, um es später freizuschalten.
export function RestaurantForm() {
  const [restaurant, setRestaurant] = useState({
    ownerName: "",
    restaurantName: "",
    email: "",
    postalCode: "",
    city: "",
    street: "",
    houseNumber: "",
    phone: "",
    website: "",
    openingHours: "",
    category: "",
    description: "",
    ownerID: "",
    subscription: "Professional",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [renderRequestBtn, setRenderRequestBtn] = useState(false);
  const [isBusinessConfirmed, setIsBusinessConfirmed] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Seite wird geladen</div>;
  }
  if (status === "unauthenticated") {
    return <div>Bitte anmelden</div>;
  }
  const handleChange = (e) => {
    const { name, value } = e.target;

    setRestaurant((prev) => ({
      ...prev,
      [name]: value,
      ownerID: session?.user?.id || "",
    }));

    try {
      restaurantSchema.pick({ [name]: true }).parse({ [name]: value });

      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [name]: err.errors[0].message,
        }));
      }
    }
  };

  const isFormValid = () => {
    try {
      restaurantSchema.parse(restaurant);
      return true;
    } catch {
      return false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);

    try {
      restaurantSchema.parse(restaurant);

      const res = await fetch("/api/restaurant/requestRegister/PremiumTier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurant),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Fehler beim Speichern");
      }

      setSuccess(true);
      setRestaurant({
        ownerName: "",
        restaurantName: "",
        email: "",
        postalCode: "",
        city: "",
        street: "",
        houseNumber: "",
        phone: "",
        website: "",
        openingHours: "",
        category: "",
        description: "",
        ownerID: "",
      });
      setErrors({});
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

  const handleProCheckout = async () => {
    /*try {
      console.log("Sende Daten:", restaurant);
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "Professional", restaurant }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      setSubmitError("Fehler beim Starten des Checkout.");
    }*/
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-16 px-4">
      <Card className="max-w-3xl mx-auto border-amber-100 shadow-xl">
        <CardContent className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-4 shadow">
              Professional · €14.99/Monat
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Dein Restaurant registrieren</h1>
            <p className="text-gray-500 max-w-md mx-auto">Fülle alle relevanten Informationen aus, damit wir dein Restaurant auf unserer Plattform anzeigen können.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
        {/* Owner Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="ownerName">
            Name (Voller legaler Name) <span className="text-red-500">*</span>
          </label>
          <input id="ownerName" name="ownerName" type="text" value={restaurant.ownerName} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.ownerName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`} />
          {errors.ownerName && <p className="text-red-500 mt-1">{errors.ownerName}</p>}
        </div>

        {/* Restaurant Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="restaurantName">
            Name des Restaurants <span className="text-red-500">*</span>
          </label>

          <input id="restaurantName" name="restaurantName" type="text" value={restaurant.restaurantName} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.restaurantName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`} />

          {errors.restaurantName && <p className="text-red-500 mt-1">{errors.restaurantName}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="name">
            Kurze Beschreibung <span className="text-red-500">*</span>
          </label>
          <input id="description" name="description" type="text" maxLength={300} value={restaurant.description} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.description ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`} />
          {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="email">
            Email<span className="text-red-500">*</span>
          </label>
          <input id="email" name="email" type="email" value={restaurant.email} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`} />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Adresse */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block font-medium text-gray-700 mb-1">
              Postleitzahl <span className="text-red-500">*</span>
            </label>
            <input id="postalCode" name="postalCode" type="text" value={restaurant.postalCode} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.postalCode ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`} />
          </div>
          <div>
            <label htmlFor="city" className="block font-medium text-gray-700 mb-1">
              Stadt <span className="text-red-500">*</span>
            </label>
            <input id="city" name="city" type="text" value={restaurant.city} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.city ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`} />
          </div>
        </div>

        {/* Straße / Hausnummer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="street" className="block font-medium text-gray-700 mb-1">
              Straße <span className="text-red-500">*</span>
            </label>
            <input id="street" name="street" type="text" value={restaurant.street} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.street ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`} />
          </div>
          <div>
            <label htmlFor="houseNumber" className="block font-medium text-gray-700 mb-1">
              Hausnummer <span className="text-red-500">*</span>
            </label>
            <input id="houseNumber" name="houseNumber" type="text" value={restaurant.houseNumber} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.houseNumber ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`} />
          </div>
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
            Telefonnummer <span className="text-red-500">*</span>
          </label>
          <input id="phone" name="phone" type="tel" value={restaurant.phone} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-amber-400"}`} />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block font-medium text-gray-700 mb-1">
            Website
          </label>
          <input id="website" name="website" type="text" value={restaurant.website} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>

        {/* Kategorie */}
        <div>
          <label htmlFor="category" className="block font-medium text-gray-700 mb-1">
            Kategorie
          </label>
          <select id="category" name="category" value={restaurant.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">Bitte wählen</option>
            <option value="italienisch">Italienisch</option>
            <option value="deutsch">Deutsch</option>
            <option value="franzoesisch">Französisch</option>
            <option value="spanisch">Spanisch / Tapas</option>
            <option value="griechisch">Griechisch</option>
            <option value="tuerkisch">Türkisch</option>
            <option value="arabisch">Arabisch</option>
            <option value="libanesisch">Libanesisch</option>
            <option value="chinesisch">Chinesisch</option>
            <option value="japanisch">Japanisch</option>
            <option value="koreanisch">Koreanisch</option>
            <option value="thailaendisch">Thailändisch</option>
            <option value="vietnamesisch">Vietnamesisch</option>
            <option value="indisch">Indisch</option>
            <option value="pakistanisch">Pakistanisch</option>
            <option value="mexikanisch">Mexikanisch</option>
            <option value="brasilianisch">Brasilianisch</option>
            <option value="argentinisch">Argentinisch</option>
            <option value="peruanisch">Peruanisch</option>
            <option value="aethiopisch">Äthiopisch</option>
            <option value="burger">Burger</option>
            <option value="hotdog">Hot Dogs</option>
            <option value="doener">Döner / Kebab</option>
            <option value="shawarma">Shawarma</option>
            <option value="fastfood">Fast Food</option>
            <option value="foodtruck">Food Truck</option>
            <option value="streetfood">Street Food</option>
            <option value="pizza">Pizza</option>
            <option value="pasta">Pasta</option>
            <option value="steakhouse">Steakhouse</option>
            <option value="bbq">BBQ / Grill</option>
            <option value="fisch">Fisch / Seafood</option>
            <option value="ramen">Ramen</option>
            <option value="sushi">Sushi</option>
            <option value="tapas">Tapas</option>
            <option value="fondue">Fondue / Raclette</option>
            <option value="hotpot">Hot Pot</option>
            <option value="cafe">Café</option>
            <option value="baeckerei">Bäckerei</option>
            <option value="konditorei">Konditorei</option>
            <option value="eiscafe">Eiscafé</option>
            <option value="bubbletea">Bubble Tea</option>
            <option value="dessertbar">Dessert Bar</option>
            <option value="waffeln">Waffeln / Crêpes</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarisch">Vegetarisch</option>
            <option value="bio">Bio / Organic</option>
            <option value="glutenfrei">Glutenfrei</option>
            <option value="lowcarb">Low Carb</option>
            <option value="halal">Halal</option>
            <option value="koscher">Koscher</option>
            <option value="bar">Bar</option>
            <option value="cocktailbar">Cocktailbar</option>
            <option value="pub">Pub</option>
            <option value="biergarten">Biergarten</option>
            <option value="weinstube">Weinstube</option>
            <option value="shishabar">Shisha Bar</option>
            <option value="fine_dining">Fine Dining</option>
            <option value="all_you_can_eat">All You Can Eat</option>
            <option value="buffet">Buffet</option>
            <option value="familienrestaurant">Familienrestaurant</option>
            <option value="im_angebot">Imbiss</option>
            <option value="lieferservice">Lieferservice</option>
            <option value="takeaway">Take Away</option>
            <option value="ghostkitchen">Ghost Kitchen</option>
            <option value="pop_up">Pop-Up Restaurant</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>

        {/* Statusmeldungen */}
        {submitError && <p className="text-red-500 font-medium">{submitError}</p>}
        {success && <p className="text-green-500 font-medium">Restaurant erfolgreich registriert!</p>}

        {/* Unternehmer-Bestätigung */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isBusinessConfirmed}
            onChange={(e) => setIsBusinessConfirmed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-indigo-600 shrink-0"
          />
          <span className="text-sm text-gray-600">
            Ich bestätige, dass ich als <strong>Unternehmer / Gewerbetreibender</strong> handle und diese Plattform ausschließlich im geschäftlichen Rahmen nutze. <span className="text-red-500">*</span>
          </span>
        </label>

        {/* Buttons */}
        <div className="pt-4">

        </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

// 🔒 Professional ist noch nicht fertig → komplett gesperrt.
// Zum Freischalten: <LockedNotice /> unten durch <RestaurantForm /> ersetzen.
function LockedNotice() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full border-amber-100 shadow-xl text-center">
        <CardContent className="p-10">
          <div className="text-5xl mb-4">🚧</div>
          <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-4 shadow">
            Professional
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">Bald verfügbar</h1>
          <p className="text-gray-500 mb-6">Die Professional-Registrierung wird gerade fertiggestellt und ist vorübergehend nicht verfügbar.</p>
          <Button asChild variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
            <Link href={`/ErstelleRestaurantAccount${queryString ? `?${queryString}` : ""}`}>Zurück zur Tarifübersicht</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LockedNotice />
    </Suspense>
  );
}
