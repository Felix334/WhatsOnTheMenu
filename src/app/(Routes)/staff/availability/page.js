"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

function AvailabilityContent() {
  const searchParams = useSearchParams();
  const restaurantID = searchParams.get("restaurantID");
  const { data: session, status } = useSession();

  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    if (!restaurantID) return;

    setLoading(true);
    fetch(`/api/staff/availability/${restaurantID}`)
      .then(async (r) => {
        const data = await r.json();
        console.log("Daten:", data)
        if (!r.ok) throw new Error(data.error || "Fehler beim Laden");
        return data;
      })
      .then((data) => setMenu(data.menu))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [restaurantID]);

  const toggleAvailability = async (dishId, currentStock) => {
    const newStock = currentStock === "outOfStock" ? "isAvailable" : "outOfStock";

    // Optimistisch sofort aktualisieren
    setMenu((prev) => ({
      ...prev,
      categoryGroup: prev.categoryGroup.map((cg) => ({
        ...cg,
        categories: cg.categories.map((cat) => ({
          ...cat,
          dishes: cat.dishes.map((d) =>
            d.id === dishId ? { ...d, stock: newStock } : d
          ),
        })),
      })),
    }));

    setUpdating((p) => ({ ...p, [dishId]: true }));

    try {
      const res = await fetch("/api/user/profil/updateDishAvailability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishId, restaurantId: restaurantID, stock: newStock }),
      });

      if (!res.ok) {
        // Zurücksetzen bei Fehler
        setMenu((prev) => ({
          ...prev,
          categoryGroup: prev.categoryGroup.map((cg) => ({
            ...cg,
            categories: cg.categories.map((cat) => ({
              ...cat,
              dishes: cat.dishes.map((d) =>
                d.id === dishId ? { ...d, stock: currentStock } : d
              ),
            })),
          })),
        }));
      }
    } catch {
      setMenu((prev) => ({
        ...prev,
        categoryGroup: prev.categoryGroup.map((cg) => ({
          ...cg,
          categories: cg.categories.map((cat) => ({
            ...cat,
            dishes: cat.dishes.map((d) =>
              d.id === dishId ? { ...d, stock: currentStock } : d
            ),
          })),
        })),
      }));
    } finally {
      setUpdating((p) => ({ ...p, [dishId]: false }));
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Laden...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Bitte einloggen.</p>
      </div>
    );
  }

  if (!restaurantID) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Kein Restaurant angegeben.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-red-200 p-6 text-center space-y-4 shadow-sm">
          <p className="text-3xl">🔒</p>
          <p className="font-semibold text-gray-800">{error}</p>
          {error.toLowerCase().includes("professional") && (
            <p className="text-sm text-gray-500">
              Die Verfügbarkeitsverwaltung ist nur mit einem{" "}
              <strong>Professional-Abonnement</strong> verfügbar.
            </p>
          )}
          <Link
            href="/staff"
            className="block w-full bg-gray-900 text-white font-semibold rounded-xl px-4 py-3 hover:bg-gray-700 transition-colors"
          >
            Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const allDishes = menu?.categoryGroup.flatMap((cg) =>
    cg.categories.flatMap((c) => c.dishes)
  ) ?? [];
  const availableCount = allDishes.filter((d) => d.stock !== "outOfStock").length;
  const unavailableCount = allDishes.filter((d) => d.stock === "outOfStock").length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={`/staff`}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            ← Zurück
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Verfügbarkeit verwalten</h1>
            <p className="text-sm text-gray-500">
              <span className="text-green-600 font-medium">{availableCount} verfügbar</span>
              {" · "}
              <span className="text-red-500 font-medium">{unavailableCount} nicht verfügbar</span>
            </p>
          </div>
        </div>

        {/* Schnellauswahl */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex gap-3">
          <button
            onClick={async () => {
              const unavailable = allDishes.filter((d) => d.stock === "outOfStock");
              for (const d of unavailable) await toggleAvailability(d.id, "outOfStock");
            }}
            className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
          >
            Alle verfügbar
          </button>
          <button
            onClick={async () => {
              const available = allDishes.filter((d) => d.stock !== "outOfStock");
              for (const d of available) await toggleAvailability(d.id, d.stock ?? "isAvailable");
            }}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
          >
            Alle ausverkauft
          </button>
        </div>

        {/* Kategorien & Gerichte */}
        {menu?.categoryGroup.map((cg) =>
          cg.categories
            .filter((cat) => cat.dishes.length > 0)
            .map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Kategorie-Header */}
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                    {cg.name}
                  </p>
                  <p className="font-semibold text-gray-800">{cat.name}</p>
                </div>

                {/* Gerichte */}
                <ul className="divide-y divide-gray-100">
                  {cat.dishes.map((dish) => {
                    const isOut = dish.stock === "outOfStock";
                    const isUpdating = updating[dish.id];

                    return (
                      <li
                        key={dish.id}
                        className="flex items-center justify-between px-5 py-4 gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              isOut ? "bg-red-400" : "bg-green-400"
                            }`}
                          />
                          <div className="min-w-0">
                            <p
                              className={`font-medium text-sm truncate ${
                                isOut ? "text-gray-400 line-through" : "text-gray-800"
                              }`}
                            >
                              {dish.name}
                            </p>
                            {dish.price != null && (
                              <p className="text-xs text-gray-400">
                                {Number(dish.price).toFixed(2)} €
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleAvailability(dish.id, dish.stock ?? "isAvailable")}
                          disabled={isUpdating}
                          className={`shrink-0 text-sm font-semibold px-4 py-1.5 rounded-xl border transition-all ${
                            isUpdating
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-wait"
                              : isOut
                              ? "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                              : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                          }`}
                        >
                          {isUpdating ? "..." : isOut ? "Verfügbar" : "Ausverkauft"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
        )}

        {allDishes.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            Keine Gerichte im Menü gefunden.
          </div>
        )}
      </div>
    </div>
  );
}

export default function AvailabilityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Laden...</div>}>
      <AvailabilityContent />
    </Suspense>
  );
}
