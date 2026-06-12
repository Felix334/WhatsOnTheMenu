"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

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
  description: z.string().max(300, "Maximal 2-3 Sätze (höchstens 300 Zeichen)").optional(),
  openingHours: z.string().optional(),
  ownerID: z.string(),
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
    category: "",
    description: "",
    openingHours: "",
    ownerID: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isBusinessConfirmed, setIsBusinessConfirmed] = useState(false);

  const { data: session, status, update } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (isAuthenticated && session?.user?.id) {
      setRestaurant((prev) => ({ ...prev, ownerID: session.user.id }));
    }
  }, [isAuthenticated, session?.user?.id]);

  if (status === "loading") {
    return <div>Seite wird geladen</div>;
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
            <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-4 shadow">
              Free · €0/Monat
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Dein Restaurant registrieren</h1>
            <p className="text-gray-500 max-w-md mx-auto">Fülle alle relevanten Informationen aus, damit wir dein Restaurant anzeigen können.</p>
          </div>

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

          <textarea name="description" maxLength={300} value={restaurant.description} onChange={handleChange} className={inputStyle("description")} />
        </div>

        {submitError && <p className="text-red-500 font-medium">{submitError}</p>}

        {success && <p className="text-green-600 font-medium">Restaurant erfolgreich registriert!</p>}

        {/* Unternehmer-Bestätigung */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isBusinessConfirmed}
            onChange={(e) => setIsBusinessConfirmed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-emerald-600 shrink-0"
          />
          <span className="text-sm text-gray-600">
            Ich bestätige, dass ich als <strong>Unternehmer / Gewerbetreibender</strong> handle und diese Plattform ausschließlich im geschäftlichen Rahmen nutze. <span className="text-red-500">*</span>
          </span>
        </label>

        <div className="space-y-3">
          {isAuthenticated ? (
            success ? (
              <></>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={!isBusinessConfirmed}
                  className={`w-full font-semibold py-3 rounded-lg transition-all ${isBusinessConfirmed ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  FreeTier registrieren
                </button>

                <div>
                  <button
                    type="button"
                    disabled={!isBusinessConfirmed}
                    onClick={async () => {
                      const res = await fetch("/api/payment/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tier: "pro" }),
                      });
                      const { url } = await res.json();
                      if (url) window.location.href = url;
                    }}
                    className={`w-full font-semibold py-3 rounded-lg transition-all ${isBusinessConfirmed ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
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
        </CardContent>
      </Card>
    </section>
  );
}
