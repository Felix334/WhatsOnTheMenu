"use client";

import { useState } from "react";
import { z } from "zod";

// Zod Schema für das Restaurant
const restaurantSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  address: z.string().min(1, "Adresse ist erforderlich"),
  phone: z
    .string()
    .min(7, "Telefonnummer zu kurz")
    .max(15, "Telefonnummer zu lang")
    .regex(/^\+?\d+$/, "Telefonnummer ungültig"),
  website: z
    .string()
    .url("Website muss eine gültige URL sein")
    .optional()
    .or(z.literal("")),
  openingHours: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

export default function RestaurantForm() {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    openingHours: "",
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

      const res = await fetch("/api/restaurants", {
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
        name: "",
        address: "",
        phone: "",
        website: "",
        openingHours: "",
        category: "",
        description: "",
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Dein Restaurant registrieren
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Fülle alle relevanten Informationen aus, damit wir dein Restaurant auf unserer Plattform anzeigen können.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="name">
            Name des Restaurants <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={restaurant.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
            }`}
          />
          {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Adresse */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="address">
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={restaurant.address}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.address ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
            }`}
          />
          {errors.address && <p className="text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* Telefonnummer */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="phone">
            Telefonnummer <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={restaurant.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.phone ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
            }`}
          />
          {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Website */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            value={restaurant.website}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.website ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
            }`}
            placeholder="https://example.com"
          />
          {errors.website && <p className="text-red-500 mt-1">{errors.website}</p>}
        </div>

        {/* Öffnungszeiten */}
        <div>
          <label className="block font-medium text-red-700 mb-1" htmlFor="openingHours">
            Öffnungszeiten(noch nicht möglich)
          </label>
          <input
            id="openingHours"
            name="openingHours"
            type="text"
            value={restaurant.openingHours}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Mo-Fr 09:00-18:00"
          />
        </div>

        {/* Kategorie */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="category">
            Kategorie
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={restaurant.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="z.B. Italienisch, Sushi, Café"
          />
        </div>

        {/* Beschreibung */}
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="description">
            Beschreibung
          </label>
          <textarea
            id="description"
            name="description"
            value={restaurant.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Erzähle uns mehr über dein Restaurant"
          />
        </div>

        {/* Statusmeldungen */}
        {submitError && <p className="text-red-500 font-medium">{submitError}</p>}
        {success && <p className="text-green-500 font-medium">Restaurant erfolgreich registriert!</p>}

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Registrieren
        </button>
      </form>
    </div>
  );
}
