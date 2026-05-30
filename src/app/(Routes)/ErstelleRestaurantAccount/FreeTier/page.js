"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";

const restaurantSchema = z.object({
  ownerName: z.string().min(2, "Ein Name ist erforderlich"),
  restaurantName: z.string().min(1, "Ein Restaurantname ist erforderlich"),
  email: z.string().email("Ungültige Email"),
  postalCode: z.string().min(4, "Postleitzahl erforderlich"),
  city: z.string().min(1, "Stadt erforderlich"),
  street: z.string().min(1, "Straße erforderlich"),
  houseNumber: z.string().min(1, "Hausnummer erforderlich"),
  phone: z
    .string()
    .min(7, "Die Telefonnummer ist zu kurz")
    .max(20, "Die Telefonnummer ist zu lang")
    .regex(/^\+?\d+$/, "Die Telefonnummer ist ungültig"),
  website: z.string().url("Die Website muss eine gültige URL sein").optional().or(z.literal("")),
  category: z.string().min(1, "Kategorie auswählen"),
  description: z.string().optional(),
  openingHours: z.string().optional(),
  ownerID: z.string(),
});

export default function RestaurantForm() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    category: "",
    description: "",
    openingHours: "",
    ownerID: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Seite wird geladen</div>;
  } else {
    if (status === "authenticated") {
      restaurant.ownerID = session?.user?.id;
      console.log(session.user.id);
      setIsAuthenticated(true);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRestaurant((prev) => ({
      ...prev,
      [name]: value,
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
      console.log("Sende Daten: ", restaurant);

      const res = await fetch("/api/restaurant/requestRegister/FreeTier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restaurant),
      });

      if (!res.ok) {
        const data = await res.json();
        console.log(data);
        throw new Error(data.message || "Fehler beim Speichern");
      }

      setSuccess(true);
      window.alert("Restaurant erfolgreich registriert! \nHerzlichen Glückwunsch!");

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
        category: "",
        description: "",
        openingHours: "",
        ownerID: session.user.id,
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

  const inputStyle = (field) => `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors[field] ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-6">Dein Restaurant registrieren</h1>

      <p className="text-gray-600 text-center mb-8">Fülle alle relevanten Informationen aus, damit wir dein Restaurant anzeigen können.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Name des Besitzers *</label>

          <input name="ownerName" value={restaurant.ownerName} onChange={handleChange} className={inputStyle("ownerName")} />

          {errors.ownerName && <p className="text-red-500">{errors.ownerName}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Restaurantname *</label>

          <input name="restaurantName" value={restaurant.restaurantName} onChange={handleChange} className={inputStyle("name")} />

          {errors.restaurantName && <p className="text-red-500">{errors.restaurantName}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Email *</label>

          <input name="email" type="email" value={restaurant.email} onChange={handleChange} className={inputStyle("email")} />

          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Postleitzahl *</label>

            <input name="postalCode" value={restaurant.postalCode} onChange={handleChange} className={inputStyle("postalCode")} />

            {errors.postalCode && <p className="text-red-500">{errors.postalCode}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Stadt *</label>

            <input name="city" value={restaurant.city} onChange={handleChange} className={inputStyle("city")} />

            {errors.city && <p className="text-red-500">{errors.city}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Straße *</label>

            <input name="street" value={restaurant.street} onChange={handleChange} className={inputStyle("street")} />

            {errors.street && <p className="text-red-500">{errors.street}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Hausnummer *</label>

            <input name="houseNumber" value={restaurant.houseNumber} onChange={handleChange} className={inputStyle("houseNumber")} />

            {errors.houseNumber && <p className="text-red-500">{errors.houseNumber}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Telefonnummer *</label>

          <input name="phone" type="tel" value={restaurant.phone} onChange={handleChange} className={inputStyle("phone")} />

          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Website</label>

          <input name="website" value={restaurant.website} onChange={handleChange} className={inputStyle("website")} />
        </div>

        <div>
          <label className="block font-medium mb-1">Öffnungszeiten</label>

          <textarea name="openingHours" value={restaurant.openingHours} onChange={handleChange} className={inputStyle("openingHours")} />
        </div>

        <div>
          <label className="block font-medium mb-1">Kategorie *</label>

          <select name="category" value={restaurant.category} onChange={handleChange} className={inputStyle("category")}>
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

          {errors.category && <p className="text-red-500">{errors.category}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Beschreibung</label>

          <textarea name="description" value={restaurant.description} onChange={handleChange} className={inputStyle("description")} />
        </div>

        {submitError && <p className="text-red-500 font-medium">{submitError}</p>}

        {success && <p className="text-green-600 font-medium">Restaurant erfolgreich registriert!</p>}

        <div className="space-y-3">
          {isAuthenticated ? (
            success ? (
              <></>
            ) : (
              <>
                <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700">
                  FreeTier registrieren
                </button>

                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await fetch("/api/payment/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tier: "pro" }),
                      });
                      const { url } = await res.json();
                      if (url) window.location.href = url;
                    }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700"
                  >
                    💳 Zu Pro upgrade (€19/Monat)
                  </button>
                </div>
              </>
            )
          ) : (
            <div>Bitte Anmelden</div>
          )}
        </div>
      </form>
    </div>
  );
}
