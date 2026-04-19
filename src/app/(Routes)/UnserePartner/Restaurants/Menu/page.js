"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = ({ name, activePage, setActivePage }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Restaurant Name / Logo */}
        <span className="text-lg font-serif font-semibold tracking-wide text-gray-900 truncate">{name || "Restaurant"}</span>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActivePage("menu")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activePage === "menu" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Speisekarte
          </button>
          <button
            onClick={() => setActivePage("info")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activePage === "info" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Informationen
          </button>
        </nav>
      </div>
    </header>
  );
};

// ─── Informationen Page ────────────────────────────────────────────────────────
const InfoPage = ({ restaurantData }) => {
  // Hier kannst du die Extrainformationen eintragen / aus der API laden
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-serif font-semibold mb-6 border-b pb-4">Informationen</h2>

        {/* Platzhalter – ersetze mit echten Daten aus restaurantData */}
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <div className="flex gap-3">
            <span className="font-medium w-32 shrink-0 text-gray-500">Postleitzahl:</span>
            <span>{restaurantData.locations?.[0]?.postalCode || ""}</span>
          </div>
          <div className="flex gap-3">
            <span className="font-medium w-32 shrink-0 text-gray-500">Stadt:</span>
            <span>{restaurantData.locations?.[0]?.city || ""}</span>
          </div>
          <div className="flex gap-3">
            <span className="font-medium w-32 shrink-0 text-gray-500">Straße:</span>
            <span>{restaurantData.locations?.[0]?.street || ""}</span>
          </div>
          <div className="flex gap-3">
            <span className="font-medium w-32 shrink-0 text-gray-500">Hausnummer:</span>
            <span>{restaurantData.locations?.[0]?.houseNumber || ""}</span>
          </div>
          <div className="flex gap-3">
            <span className="font-medium w-32 shrink-0 text-gray-500">Postleitzahl:</span>
            <span>{restaurantData.locations?.[0]?.postalCode || ""}</span>
          </div>
          <div className="flex gap-3">
            <span className="font-medium w-32 shrink-0 text-gray-500">Telefon:</span>
            <span>{restaurantData?.phone ?? "–"}</span>
          </div>
          <div className="flex gap-3">
            <span className="font-medium w-32 shrink-0 text-gray-500">E-Mail</span>
            <span>{restaurantData?.email ?? "–"}</span>
          </div>
          <div className="flex gap-3">
            <span className="font-medium w-32 shrink-0 text-gray-500">Öffnungszeiten</span>
            <span>{restaurantData?.openingHours ?? "–"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Menu Section ──────────────────────────────────────────────────────────────
const MenuSection = ({ id, title, menuItems }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div id={id} className="bg-white rounded-2xl shadow-xl w-full py-8 px-4 sm:px-6 md:px-10 transition-all scroll-mt-24">
      <div className="mb-8 text-center border-b pb-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold tracking-wide">{title}</h3>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table className="w-full min-w-[700px] table-fixed">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-left font-semibold">Speisen</TableHead>
              <TableHead className="text-right font-semibold w-28">Preis</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {menuItems?.map((item, index) => (
              <React.Fragment key={item.id || index}>
                <TableRow onClick={() => toggleExpand(index)} className="cursor-pointer transition-all duration-200 hover:bg-yellow-50 border-b">
                  <TableCell className="align-top py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-serif text-gray-900 truncate">{item.name}</span>
                      {item.description && <span className="text-sm text-gray-500 break-words leading-relaxed">{item.description}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono whitespace-nowrap align-top py-4 w-28">{parseFloat(item.price || 0).toFixed(2)}€</TableCell>
                </TableRow>

                {expandedIndex === index && item.imageUrl && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={2} className="p-5">
                      <div className="shadow-sm overflow-hidden">
                        <Image src={item.imageUrl} alt={item.name} width={900} height={600} className="w-full h-auto object-cover" />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// ─── Category Nav (nur auf Speisekarte) ───────────────────────────────────────
const CategoryNav = ({ categories, activeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-16 z-40 w-full bg-white/90 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <ul className="hidden sm:flex flex-wrap gap-2 py-3 items-center">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => scrollTo(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border
                  ${activeId === cat.id ? "bg-yellow-400 border-yellow-400 text-gray-900" : "bg-white border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300"}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="sm:hidden py-3" ref={dropdownRef}>
          <button onClick={() => setIsOpen((o) => !o)} className="w-full flex items-center justify-between px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700">
            <span>{categories.find((c) => c.id === activeId)?.name ?? "Kategorie wählen"}</span>
            <span className={`ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
          </button>

          {isOpen && (
            <ul className="absolute left-4 right-4 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => scrollTo(cat.id)}
                    className={`w-full text-left px-4 py-3 text-sm border-b last:border-0 transition-colors
                      ${activeId === cat.id ? "bg-yellow-50 font-semibold text-yellow-700" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

// ─── Main Content ──────────────────────────────────────────────────────────────
const MenuContent = () => {
  const searchParams = useSearchParams();
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [activePage, setActivePage] = useState("menu"); // "menu" | "info"

  useEffect(() => {
    const restaurantID = searchParams.get("restaurantID");
    if (!restaurantID) {
      setError("Keine Restaurant-ID in der URL gefunden");
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        const resp = await fetch(`/api/restaurant/${restaurantID}/menu`, {
          method: "GET",
          next: { revalidate: 300 },
        });

        if (!resp.ok) {
          if (resp.status === 404) throw new Error("Restaurant nicht gefunden!");
          if (resp.status === 500) throw new Error("Internal Server Error");
          throw new Error(`Fehler beim Abrufen der Daten: ${resp.status}`);
        }

        const data = await resp.json();
        console.log("Server Data:", data);
        setServerData(data);
        setName(data.name || "Unbenanntes Restaurant");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [searchParams]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Es ist ein Fehler aufgetreten: {error}</div>;

  const menuEntry = serverData?.menu?.[0];
  const bgColor = menuEntry?.bgColor;
  const categoryGroups = menuEntry?.categoryGroup ?? [];
  const allCategories = categoryGroups.flatMap((group) => group.categories ?? []);
  const font = "Oswald";

  const totalPrice = allCategories.flatMap((cat) => cat.dishes ?? []).reduce((sum, dish) => sum + parseFloat(dish.price || 0), 0);

  return (
    <div
      className={`min-h-screen flex flex-col text-gray-900 font-sans
        ${bgColor ? "" : "bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200"}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      {/* Sticky Header mit Tab-Nav */}
      <Header name={name} activePage={activePage} setActivePage={setActivePage} />

      {/* Kategorie-Nav nur auf Speisekarte */}
      {activePage === "menu" && allCategories.length > 0 && <CategoryNav categories={allCategories} activeId={activeId} />}

      {/* Page Content */}
      {activePage === "info" ? (
        <InfoPage restaurantData={serverData} />
      ) : (
        <main className="w-full max-w-5xl sm:max-w-6xl md:max-w-7xl mx-auto z-10 px-2 sm:px-4 md:px-0 py-8">
          {menuEntry?.name && (
            <p className="mb-6 text-center text-gray-500 text-lg" style={font ? { fontFamily: font } : undefined}>
              {menuEntry.name}
            </p>
          )}

          <div className="space-y-8 sm:space-y-10 md:space-y-12">{allCategories.length > 0 ? allCategories.map((category) => <MenuSection key={category.id} id={category.id} title={category.name} menuItems={category.dishes} />) : <div className="text-center">Keine Kategorien gefunden</div>}</div>

          <p className="mt-8 text-right font-semibold text-lg">Gesamtpreis: {totalPrice.toFixed(2)}€</p>

          <details className="mt-8">
            <summary className="cursor-pointer font-medium">Debug Data</summary>
            <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto text-sm">{JSON.stringify(serverData, null, 2)}</pre>
          </details>
        </main>
      )}
    </div>
  );
};

function MenuSkeleton() {
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}

export default function Menu() {
  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuContent />
    </Suspense>
  );
}
