"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { Subscription } from "@prisma/client";

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
  description: z.string().optional(),
});

export default function RestaurantForm() {
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
    subscription: "Premium"
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
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
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "pro", restaurant }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      setSubmitError("Fehler beim Starten des Checkout.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dein Restaurant registrieren</h1>
      <p className="text-gray-600 text-center mb-8">Fülle alle relevanten Informationen aus, damit wir dein Restaurant auf unserer Plattform anzeigen können.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Owner Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="ownerName">
            Name (Voller legaler Name) <span className="text-red-500">*</span>
          </label>
          <input id="ownerName" name="ownerName" type="text" value={restaurant.ownerName} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.ownerName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.ownerName && <p className="text-red-500 mt-1">{errors.ownerName}</p>}
        </div>

        {/* Restaurant Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="restaurantName">
            Name des Restaurants <span className="text-red-500">*</span>
          </label>

          <input id="restaurantName" name="restaurantName" type="text" value={restaurant.restaurantName} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.restaurantName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />

          {errors.restaurantName && <p className="text-red-500 mt-1">{errors.restaurantName}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="name">
            Kurze Beschreibung <span className="text-red-500">*</span>
          </label>
          <input id="description" name="description" type="text" value={restaurant.description} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.description ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="email">
            Email<span className="text-red-500">*</span>
          </label>
          <input id="email" name="email" type="email" value={restaurant.email} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Adresse */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block font-medium text-gray-700 mb-1">
              Postleitzahl <span className="text-red-500">*</span>
            </label>
            <input id="postalCode" name="postalCode" type="text" value={restaurant.postalCode} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.postalCode ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          </div>
          <div>
            <label htmlFor="city" className="block font-medium text-gray-700 mb-1">
              Stadt <span className="text-red-500">*</span>
            </label>
            <input id="city" name="city" type="text" value={restaurant.city} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.city ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          </div>
        </div>

        {/* Straße / Hausnummer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="street" className="block font-medium text-gray-700 mb-1">
              Straße <span className="text-red-500">*</span>
            </label>
            <input id="street" name="street" type="text" value={restaurant.street} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.street ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          </div>
          <div>
            <label htmlFor="houseNumber" className="block font-medium text-gray-700 mb-1">
              Hausnummer <span className="text-red-500">*</span>
            </label>
            <input id="houseNumber" name="houseNumber" type="text" value={restaurant.houseNumber} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.houseNumber ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          </div>
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
            Telefonnummer <span className="text-red-500">*</span>
          </label>
          <input id="phone" name="phone" type="tel" value={restaurant.phone} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
        </div>

        {/* Website / Öffnungszeiten */}
        <div>
          <label htmlFor="website" className="block font-medium text-gray-700 mb-1">
            Website
          </label>
          <input id="website" name="website" type="text" value={restaurant.website} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label htmlFor="openingHours" className="block font-medium text-gray-700 mb-1">
            Öffnungszeiten
          </label>
          <input id="openingHours" name="openingHours" type="text" value={restaurant.openingHours} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Mo-Fr 09:00-18:00" />
        </div>

        {/* Kategorie */}
        <div>
          <label htmlFor="category" className="block font-medium text-gray-700 mb-1">
            Kategorie
          </label>
          <select id="category" name="category" value={restaurant.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
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

        {/* Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg text-lg">
            ✅ Pro Tier registrieren (nach Abo)
          </button>
          <button type="button" onClick={handleProCheckout} className="w-full bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-xl text-lg border-2 border-transparent hover:border-indigo-300">
            💳 Pro Abo aktivieren (€19/Monat)
          </button>
        </div>
      </form>
    </div>
  );
}
