"use client";

import { useState } from "react";
import { z } from "zod";

// Zod Schema für das Restaurant
const restaurantSchema = z.object({
  ownerName: z.string().min(2, "Ein Name ist erforderlich"),
  name: z.string().min(1, "Ein Restaurantname ist erforderlich"),
  address: z.string().min(1, "Eine Adresse ist erforderlich"),
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
    name: "",
    email: "",
    address: "",
    phone: "",
    website: "",
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant({ ...restaurant, [name]: value });

    // Echtzeit Validierung
    try {
      restaurantSchema.pick({ [name]: true }).parse({ [name]: value });
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.errors[0].message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);

    // Validierung mit Zod
    try {
      restaurantSchema.parse(restaurant);

      const res = await fetch("/api/restaurant/requestRegister/FreeTier", {
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
        name: "",
        email: "",
        postalCode: "",
        city: "",
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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dein Restaurant registrieren</h1>
      <p className="text-gray-600 text-center mb-8">Fülle alle relevanten Informationen aus, damit wir dein Restaurant auf unserer Plattform anzeigen können.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="name">
            Name (Voller legaler Name) <span className="text-red-500">*</span>
          </label>
          <input id="ownerName" name="Name des Besitzers" type="text" value={restaurant.ownerName} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.ownerName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.ownerName && <p className="text-red-500 mt-1">{errors.ownerName}</p>}
        </div>
        {/* Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="name">
            Name des Restaurants <span className="text-red-500">*</span>
          </label>
          <input id="name" name="Name" type="text" value={restaurant.name} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="name">
            Email<span className="text-red-500">*</span>
          </label>
          <input id="email" name="email" type="email" value={restaurant.email} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Adresse */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="address">
            Postleitzahl <span className="text-red-500">*</span>
          </label>
          <input id="postalCode" name="Postleitzahl" type="text" value={restaurant.postalCode} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.postalCode ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.address && <p className="text-red-500 mt-1">{errors.postalCode}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="address">
            Stadt <span className="text-red-500">*</span>
          </label>
          <input id="town" name="town" type="text" value={restaurant.city} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.city ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.address && <p className="text-red-500 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="address">
            Straße <span className="text-red-500">*</span>
          </label>
          <input id="street" name="Straße" type="text" value={restaurant.street} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.street ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.address && <p className="text-red-500 mt-1">{errors.address}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="address">
            Hausnummer <span className="text-red-500">*</span>
          </label>
          <input id="houseNumber" name="Hausnummer" type="text" value={restaurant.houseNumber} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.address ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.address && <p className="text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* Telefonnummer */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="phone">
            Telefonnummer <span className="text-red-500">*</span>
          </label>
          <input id="phone" name="phone" type="tel" value={restaurant.phone} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`} />
          {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Website */}

        {/* Öffnungszeiten */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="category">
            Kategorie wählen:
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

        {/* Button */}
        <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          Registrieren
        </button>
      </form>
    </div>
  );
}
