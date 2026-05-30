"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";

// ─── Hero-Farben ──────────────────────────────────────────────────────────────
const HERO_COLOR_PRESETS = [
  { key: "amber",  gradient: "from-amber-700 via-orange-600 to-amber-600" },
  { key: "green",  gradient: "from-emerald-700 via-green-600 to-teal-600" },
  { key: "blue",   gradient: "from-blue-700 via-indigo-600 to-blue-600" },
  { key: "red",    gradient: "from-red-700 via-rose-600 to-red-500" },
  { key: "purple", gradient: "from-purple-700 via-violet-600 to-purple-500" },
  { key: "dark",   gradient: "from-gray-900 via-gray-800 to-gray-700" },
];
const HERO_GRADIENT_MAP = Object.fromEntries(
  HERO_COLOR_PRESETS.map(({ key, gradient }) => [key, gradient])
);

// ─── Öffnungsstatus berechnen ──────────────────────────────────────────────────
const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function getOpenStatus(openingHours) {
  if (!openingHours) return { isOpen: false, todayHours: null };
  const now = new Date();
  const day = openingHours[DAY_KEYS[now.getDay()]];
  if (!day || day.closed) return { isOpen: false, todayHours: null };
  const [oh, om] = (day.open || "00:00").split(":").map(Number);
  const [ch, cm] = (day.close || "00:00").split(":").map(Number);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isOpen = nowMin >= oh * 60 + om && nowMin < ch * 60 + cm;
  return { isOpen, todayHours: `${day.open} – ${day.close} Uhr` };
}

// ─── Social Icons ─────────────────────────────────────────────────────────────
const SOCIAL_ICONS = [
  { key: "instagram", label: "Instagram", icon: "📸" },
  { key: "facebook",  label: "Facebook",  icon: "📘" },
  { key: "tiktok",    label: "TikTok",    icon: "🎵" },
  { key: "twitter",   label: "X",         icon: "𝕏" },
  { key: "whatsapp",  label: "WhatsApp",  icon: "💬" },
  { key: "website",   label: "Website",   icon: "🌐" },
];

// ─── Hero-Banner ───────────────────────────────────────────────────────────────
const HeroSection = ({ restaurantData }) => {
  const loc = restaurantData?.locations?.[0];
  const { isOpen, todayHours } = getOpenStatus(restaurantData?.openingHours);

  return (
    <div className={`w-full bg-gradient-to-r ${HERO_GRADIENT_MAP[restaurantData?.menu?.[0]?.heroColor] ?? HERO_GRADIENT_MAP.amber} text-white py-10 px-4 text-center`}>
      <p className="text-amber-200 uppercase tracking-widest text-xs font-semibold mb-2">Speisekarte</p>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-wide drop-shadow">
        {restaurantData?.name || "Restaurant"}
      </h1>
      {restaurantData?.menu?.[0]?.description && (
        <p className="mt-3 text-amber-100 text-sm max-w-md mx-auto italic">
          {restaurantData.menu[0].description}
        </p>
      )}
      {loc && (
        <p className="mt-3 text-amber-100 text-sm">
          {loc.street} {loc.houseNumber}, {loc.postalCode} {loc.city}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold ${
          isOpen
            ? "bg-green-500/80 text-white"
            : "bg-black/30 text-amber-200"
        }`}>
          <span className={`inline-block w-2 h-2 rounded-full ${isOpen ? "bg-white animate-pulse" : "bg-amber-400"}`} />
          {isOpen ? "Jetzt geöffnet" : "Derzeit geschlossen"}
        </span>
        {todayHours && (
          <span className="text-amber-100">{todayHours}</span>
        )}
      </div>

      {/* Social Media Links */}
      {restaurantData?.socialLinks && Object.values(restaurantData.socialLinks).some(Boolean) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {SOCIAL_ICONS.filter(({ key }) => restaurantData.socialLinks[key]).map(({ key, label, icon }) => (
            <a
              key={key}
              href={restaurantData.socialLinks[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all"
            >
              <span>{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Header (Tab-Navigation) ──────────────────────────────────────────────────
const Header = ({ name, activePage, setActivePage }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2 flex items-center justify-between h-12 gap-2">
        <span className="text-sm font-serif font-semibold text-gray-500 truncate hidden sm:block">{name || "Restaurant"}</span>
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
// ─── Öffnungszeiten-Anzeige ────────────────────────────────────────────────────
const DAYS_DE = [
  { key: "monday",    label: "Montag" },
  { key: "tuesday",   label: "Dienstag" },
  { key: "wednesday", label: "Mittwoch" },
  { key: "thursday",  label: "Donnerstag" },
  { key: "friday",    label: "Freitag" },
  { key: "saturday",  label: "Samstag" },
  { key: "sunday",    label: "Sonntag" },
];

const OpeningHoursDisplay = ({ hours }) => {
  if (!hours || Object.keys(hours).length === 0) return <span className="text-gray-400">–</span>;
  return (
    <div className="space-y-1 text-sm">
      {DAYS_DE.map(({ key, label }) => {
        const day = hours[key];
        if (!day) return null;
        return (
          <div key={key} className="flex gap-3">
            <span className="w-28 text-gray-500 font-medium">{label}</span>
            {day.closed
              ? <span className="text-gray-400">Geschlossen</span>
              : <span>{day.open} – {day.close} Uhr</span>}
          </div>
        );
      })}
    </div>
  );
};

// ─── Informationen Page ────────────────────────────────────────────────────────
const InfoPage = ({ restaurantData }) => {
  const loc = restaurantData.locations?.[0];
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

        {/* Adresse */}
        <div>
          <h2 className="text-2xl font-serif font-semibold mb-4 border-b pb-3">Informationen</h2>
          <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
            {loc && (
              <>
                <div className="flex gap-3">
                  <span className="font-medium w-32 shrink-0 text-gray-500">Adresse:</span>
                  <span>
                    {loc.street} {loc.houseNumber}, {loc.postalCode} {loc.city}
                    {loc.country ? `, ${loc.country}` : ""}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Öffnungszeiten */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Öffnungszeiten</h3>
          <OpeningHoursDisplay hours={restaurantData?.openingHours} />
        </div>
      </div>
    </div>
  );
};

// ─── Allergen-Legende ──────────────────────────────────────────────────────────
const ALLERGEN_LIST = [
  { letter: "A", name: "Gluten" },       { letter: "B", name: "Krebstiere" },
  { letter: "C", name: "Eier" },         { letter: "D", name: "Fisch" },
  { letter: "E", name: "Erdnüsse" },     { letter: "F", name: "Soja" },
  { letter: "G", name: "Milch" },        { letter: "H", name: "Schalenfrüchte" },
  { letter: "I", name: "Sellerie" },     { letter: "J", name: "Senf" },
  { letter: "K", name: "Sesam" },        { letter: "L", name: "Sulfite" },
  { letter: "M", name: "Lupinen" },      { letter: "N", name: "Weichtiere" },
];

const AllergenLegend = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-300">A</span>
        Allergen-Legende
        <span className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-2 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
          {ALLERGEN_LIST.map(({ letter, name }) => (
            <div key={letter} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 shrink-0">
                {letter}
              </span>
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Allergen Badges ───────────────────────────────────────────────────────────
const ALLERGEN_LETTER = {
  "Gluten": "A", "Krebstiere": "B", "Eier": "C", "Fisch": "D",
  "Erdnüsse": "E", "Soja": "F", "Milch": "G", "Schalenfrüchte": "H",
  "Sellerie": "I", "Senf": "J", "Sesam": "K", "Sulfite": "L",
  "Lupinen": "M", "Weichtiere": "N",
};

const AllergenBadges = ({ ingredients }) => {
  if (!ingredients || ingredients.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {ingredients.map((ing) => (
        <span
          key={ing.id}
          title={ing.name}
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300"
        >
          {ALLERGEN_LETTER[ing.name] ?? "?"}
        </span>
      ))}
    </div>
  );
};

// ─── Menu Section ──────────────────────────────────────────────────────────────
const MenuSection = ({ id, title, menuItems, bgColor }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div id={id} className={`${bgColor} rounded-2xl shadow-xl w-full py-8 px-4 sm:px-6 md:px-10 transition-all scroll-mt-24`}>
      <div className="mb-8 text-center pb-6">
        <h3 className="text-3xl sm:text-3xl md:text-4xl font-serif font-semibold tracking-wide">{title}</h3>
      </div>

      {/* Mobile: Card-Layout */}
      <div className="block sm:hidden space-y-3">
        {menuItems?.map((item, index) => {
          const unavailable = item.stock === "outOfStock";
          return (
          <React.Fragment key={item.id || index}>
            <div onClick={() => !unavailable && toggleExpand(index)} className={`flex justify-between items-start py-3 border-b transition-colors ${unavailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-yellow-50"}`}>
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <p className={`font-serif ${unavailable ? "text-gray-400 line-through" : "text-gray-900"}`}>{item.name}</p>
                  {unavailable && <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">Nicht verfügbar</span>}
                </div>
                {item.description && <p className="text-sm text-gray-500 leading-relaxed mt-1">{item.description}</p>}
                <AllergenBadges ingredients={item.ingredients} />
              </div>
              <span className={`font-mono whitespace-nowrap text-sm ${unavailable ? "text-gray-400 line-through" : ""}`}>{parseFloat(item.price || 0).toFixed(2)}€</span>
            </div>
            {expandedIndex === index && item.imageUrl && (
              <div className="pb-3">
                <Image src={item.imageUrl} alt={item.name} width={900} height={600} className="w-full h-auto object-cover rounded-xl shadow-sm" />
              </div>
            )}
          </React.Fragment>
        );
        })}
      </div>

      {/* Desktop: Tabelle */}
      <div className="hidden sm:block rounded-xl border">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left font-semibold">Speisen</TableHead>
              <TableHead className="text-right font-semibold w-28">Preis</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {menuItems?.map((item, index) => {
              const unavailable = item.stock === "outOfStock";
              return (
              <React.Fragment key={item.id || index}>
                <TableRow
                  onClick={() => !unavailable && toggleExpand(index)}
                  className={`transition-all duration-200 border-b ${unavailable ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:bg-yellow-50"}`}
                >
                  <TableCell className="align-top py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-serif ${unavailable ? "text-gray-400 line-through" : "text-gray-900"}`}>{item.name}</span>
                        {unavailable && (
                          <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                            Nicht verfügbar
                          </span>
                        )}
                      </div>
                      {item.description && <span className="text-sm text-gray-500 leading-relaxed">{item.description}</span>}
                      <AllergenBadges ingredients={item.ingredients} />
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-mono whitespace-nowrap align-top py-4 w-28 ${unavailable ? "text-gray-400 line-through" : ""}`}>
                    {parseFloat(item.price || 0).toFixed(2)}€
                  </TableCell>
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// ─── Category Nav ──────────────────────────────────────────────────────────────
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
    <nav className="sticky mt-1 sm:md-23 z-40 w-full bg-white/90 backdrop-blur-sm border-b shadow-sm">
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
  const [activePage, setActivePage] = useState("menu");

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
        console.log("Server Daten(Sort)",data)
        data.menu[0].categoryGroup.sort((a, b) => Number(a.position) - Number(b.position));
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

  return (
    <div className={`min-h-screen flex flex-col text-gray-900 font-sans ${bgColor ? "" : "bg-amber-50"}`} style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <Header name={name} activePage={activePage} setActivePage={setActivePage} />
      <HeroSection restaurantData={serverData} />
      {activePage === "menu" && categoryGroups.length > 0 && <CategoryNav categories={categoryGroups.flatMap((g) => g.categories ?? [])} activeId={activeId} />}

      {activePage === "info" ? (
        <InfoPage restaurantData={serverData} />
      ) : (
        <>
          <main className="w-full max-w-7xl mx-auto px-4 py-8">
            {categoryGroups.length > 0 ? (
              <div className="space-y-12">
                {categoryGroups.map((group) => (
                  <div key={group.id} className={`bg-white rounded-2xl shadow-sm p-6 border border-amber-100 ${group.color}`}>
                    <h2 className="text-2xl font-semibold mb-6 pb-2">{group.name}</h2>
                    <div className="space-y-8">
                      {group.categories?.map((category) => (
                        <MenuSection key={category.id} id={category.id} title={category.name} menuItems={category.dishes} bgColor={category.bgColor} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10">Keine Kategorien gefunden</div>
            )}
          </main>
          <AllergenLegend />
        </>
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
