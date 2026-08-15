"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";

import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { bgColorClass, bgColorStyle } from "./colorPicker";
import { GOOGLE_FONTS_URL } from "@/app/(Routes)/Profil/components/fontList";
import Link from "next/link";

// ─── Hero-Farben ──────────────────────────────────────────────────────────────
const HERO_COLOR_PRESETS = [
  { key: "amber", gradient: "from-amber-700 via-orange-600 to-amber-600" },
  { key: "green", gradient: "from-emerald-700 via-green-600 to-teal-600" },
  { key: "blue", gradient: "from-blue-700 via-indigo-600 to-blue-600" },
  { key: "red", gradient: "from-red-700 via-rose-600 to-red-500" },
  { key: "purple", gradient: "from-purple-700 via-violet-600 to-purple-500" },
  { key: "dark", gradient: "from-gray-900 via-gray-800 to-gray-700" },
];
const HERO_GRADIENT_MAP = Object.fromEntries(HERO_COLOR_PRESETS.map(({ key, gradient }) => [key, gradient]));

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
  { key: "facebook", label: "Facebook", icon: "📘" },
  { key: "tiktok", label: "TikTok", icon: "🎵" },
  { key: "twitter", label: "X", icon: "𝕏" },
  { key: "whatsapp", label: "WhatsApp", icon: "💬" },
  { key: "website", label: "Website", icon: "🌐" },
  { key: "google", label: "Google-Bewertung", icon: "⭐" },
];

// ─── Hero-Banner ───────────────────────────────────────────────────────────────
const HeroSection = ({ restaurantData, menuFont, color }) => {
  const { isOpen, todayHours } = getOpenStatus(restaurantData?.openingHours);
  if (process.env.NODE_ENV === "development") console.log("Zeige HeroColor:", color);

  return (
    <div className={`w-full ${color?.startsWith("#") ? "" : `bg-linear-to-r ${HERO_GRADIENT_MAP[color] ?? HERO_GRADIENT_MAP.amber}`} text-white py-10 px-4 text-center`} style={color?.startsWith("#") ? { background: color } : {}}>
      <p className="text-amber-200 uppercase tracking-widest text-xs font-semibold mb-2">Speisekarte</p>
      <h1 style={{ fontFamily: menuFont || undefined, color: restaurantData?.menu?.[0]?.heroTextColor }} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide drop-shadow">
        {restaurantData?.name || "Restaurant"}
      </h1>
      {restaurantData?.description && (
        <p className="mt-3 text-white/80 text-base max-w-lg mx-auto" style={{ color: restaurantData.menu?.[0]?.heroTextColor }}>
          {restaurantData.description}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold ${isOpen ? "bg-green-500/80 text-white" : "bg-black/30 text-amber-200"}`}>
          <span className={`inline-block w-2 h-2 rounded-full ${isOpen ? "bg-white animate-pulse" : "bg-amber-400"}`} />
          {isOpen ? "Jetzt geöffnet" : "Derzeit geschlossen"}
        </span>
        {todayHours && <span className="text-amber-100">{todayHours}</span>}
      </div>

      {/* Social Media Links */}
      {restaurantData?.socialLinks && Object.values(restaurantData.socialLinks).some(Boolean) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {SOCIAL_ICONS.filter(({ key }) => restaurantData.socialLinks[key]).map(({ key, label, icon }) => (
            <a key={key} href={restaurantData.socialLinks[key]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all">
              <span>{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = ({ name, activePage, setActivePage, hasEvents, eventCount }) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-8 py-2 flex items-center h-12 gap-1">
        {/* Linke Seite: gleiche flex-1 wie rechts, damit die Tabs exakt zentriert bleiben */}
        <div className="flex-1 flex justify-start min-w-0">
          <Link href={{ pathname: "/", query: { ...router.query } }} prefetch={false} className="inline-flex items-center gap-2 px-2 sm:px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900" aria-label="Zur Homepage">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden md:inline">Homepage</span>
          </Link>
        </div>
        <nav className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActivePage("menu")}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
              ${activePage === "menu" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Speisekarte
          </button>
          <button
            onClick={() => setActivePage("info")}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
              ${activePage === "info" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Informationen
          </button>

          <button
            onClick={() => setActivePage("events")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activePage === "events" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Aktionen
            {hasEvents ? (
              <>
                <span className="inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold leading-none">{eventCount}</span>
              </>
            ) : (
              <></>
            )}
          </button>
        </nav>
        <div className="flex-1" aria-hidden="true" />
      </div>
    </header>
  );
};
// ─── Öffnungszeiten-Anzeige ────────────────────────────────────────────────────
const DAYS_DE = [
  { key: "monday", label: "Montag" },
  { key: "tuesday", label: "Dienstag" },
  { key: "wednesday", label: "Mittwoch" },
  { key: "thursday", label: "Donnerstag" },
  { key: "friday", label: "Freitag" },
  { key: "saturday", label: "Samstag" },
  { key: "sunday", label: "Sonntag" },
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
            {day.closed ? (
              <span className="text-gray-400">Geschlossen</span>
            ) : (
              <span>
                {day.open} – {day.close} Uhr
              </span>
            )}
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

// ─── Aktionen & Events Page ─────────────────────────────────────────────────────
const EVENT_GROUP_ORDER = ["Aktuell laufend", "Heute", "Morgen", "Diese Woche", "Demnächst"];

const startOfDay = (value) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Errechnet Gruppierungs-Schlüssel und Anzeige-Label ("Heute", "Läuft noch 2 Tage", ...)
// für einen Kalendereintrag, relativ zu heute.
function getEventDateInfo(entry) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const today = startOfDay(new Date());
  const start = startOfDay(entry.date);
  const end = entry.endDate ? startOfDay(entry.endDate) : start;
  const isMultiDay = !!entry.endDate;
  const isActive = isMultiDay && today >= start && today <= end;
  const daysUntil = Math.round((start - today) / DAY_MS);

  let label;
  let groupKey;
  if (isActive) {
    const daysLeft = Math.round((end - today) / DAY_MS);
    label = daysLeft <= 0 ? "Letzter Tag" : `Läuft noch ${daysLeft} Tag${daysLeft === 1 ? "" : "e"}`;
    groupKey = "Aktuell laufend";
  } else if (daysUntil <= 0) {
    label = isMultiDay ? "Startet heute" : "Heute";
    groupKey = "Heute";
  } else if (daysUntil === 1) {
    label = isMultiDay ? "Startet morgen" : "Morgen";
    groupKey = "Morgen";
  } else if (daysUntil < 7) {
    label = isMultiDay ? `Startet ${start.toLocaleDateString("de-DE", { weekday: "long" })}` : start.toLocaleDateString("de-DE", { weekday: "long" });
    groupKey = "Diese Woche";
  } else {
    label = isMultiDay ? `Startet ${start.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}` : start.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
    groupKey = "Demnächst";
  }

  return { isMultiDay, isActive, label, groupKey };
}

const CALENDAR_TYPE_STYLE = {
  promotion: { icon: "🏷️", label: "Aktion", ring: "border-amber-200", chip: "bg-amber-100 text-amber-800 border-amber-300", iconBg: "bg-linear-to-br from-amber-200 to-amber-100", wash: "from-amber-50/80", groupDot: "bg-amber-400" },
  event: { icon: "🎉", label: "Event", ring: "border-violet-200", chip: "bg-violet-100 text-violet-800 border-violet-300", iconBg: "bg-linear-to-br from-violet-200 to-violet-100", wash: "from-violet-50/80", groupDot: "bg-violet-400" },
  specialDish: { icon: "🍽️", label: "Tagesgericht", ring: "border-emerald-200", chip: "bg-emerald-100 text-emerald-800 border-emerald-300", iconBg: "bg-linear-to-br from-emerald-200 to-emerald-100", wash: "from-emerald-50/80", groupDot: "bg-emerald-400" },
};

const EventDateRange = ({ entry }) =>
  entry.endDate
    ? `${new Date(entry.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })} – ${new Date(entry.endDate).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}`
    : `${new Date(entry.date).toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "2-digit" })}${entry.startTime && entry.endTime ? ` · ${entry.startTime}–${entry.endTime} Uhr` : " · Ganztägig"}`;

const EventCard = ({ entry, info }) => {
  const style = CALENDAR_TYPE_STYLE[entry.type] ?? CALENDAR_TYPE_STYLE.event;
  return (
    <div className={`relative overflow-hidden flex flex-col sm:flex-row gap-5 bg-linear-to-br ${style.wash} to-white border ${style.ring} rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <div className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${style.iconBg} flex items-center justify-center text-3xl sm:text-4xl shadow-inner`}>{style.icon}</div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${style.chip}`}>{style.label}</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-500">{info.label}</span>
        </div>
        <p className="text-xl sm:text-2xl font-serif font-bold text-gray-900 leading-snug">{entry.eventName}</p>
        {entry.eventDescription && <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{entry.eventDescription}</p>}
        <p className="text-xs sm:text-sm text-gray-400 font-medium">
          <EventDateRange entry={entry} />
        </p>

        {entry.type === "specialDish" && entry.dish && (
          <div className="mt-3 flex items-center gap-4 bg-white/80 border border-emerald-100 rounded-2xl p-3 shadow-sm">
            {entry.dish.imageUrl && <Image src={entry.dish.imageUrl} alt={entry.dish.name} width={72} height={72} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0" />}
            <p className="min-w-0 flex-1 text-base font-semibold text-gray-900 truncate">{entry.dish.name}</p>
            {entry.dish.price != null && <span className="text-base font-mono font-bold text-emerald-700 shrink-0">{parseFloat(entry.dish.price).toFixed(2)}€</span>}
          </div>
        )}
      </div>
    </div>
  );
};

const EventsPage = ({ entries }) => {
  const groups = {};
  for (const entry of entries) {
    const info = getEventDateInfo(entry);
    (groups[info.groupKey] ??= []).push({ entry, info });
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-14 px-4 space-y-12">
      <div className="text-center space-y-3">
        <p className="text-5xl">📅</p>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900">Aktionen &amp; Events</h2>
        <p className="text-base text-gray-500">Alles, was gerade bei uns läuft oder demnächst ansteht.</p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-14 text-center text-gray-400">
          <p className="text-5xl mb-4">🍃</p>
          <p className="text-lg">Aktuell keine Aktionen oder Events.</p>
        </div>
      ) : (
        EVENT_GROUP_ORDER.filter((key) => groups[key]?.length).map((key) => {
          const groupStyle = CALENDAR_TYPE_STYLE[groups[key][0].entry.type] ?? CALENDAR_TYPE_STYLE.event;
          return (
            <div key={key} className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                <span className={`w-2.5 h-2.5 rounded-full ${groupStyle.groupDot}`} />
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">{key}</h3>
                <span className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="space-y-4">
                {groups[key].map(({ entry, info }) => (
                  <EventCard key={entry.id} entry={entry} info={info} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

// ─── Allergen-Legende ──────────────────────────────────────────────────────────
const ALLERGEN_LIST = [
  { letter: "A", name: "Gluten" },
  { letter: "B", name: "Krebstiere" },
  { letter: "C", name: "Eier" },
  { letter: "D", name: "Fisch" },
  { letter: "E", name: "Erdnüsse" },
  { letter: "F", name: "Soja" },
  { letter: "G", name: "Milch" },
  { letter: "H", name: "Schalenfrüchte" },
  { letter: "I", name: "Sellerie" },
  { letter: "J", name: "Senf" },
  { letter: "K", name: "Sesam" },
  { letter: "L", name: "Sulfite" },
  { letter: "M", name: "Lupinen" },
  { letter: "N", name: "Weichtiere" },
];

const AllergenLegend = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-10">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-300">A</span>
        Allergen-Legende
        <span className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-2 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
          {ALLERGEN_LIST.map(({ letter, name }) => (
            <div key={letter} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 shrink-0">{letter}</span>
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Allergen-Filter (Gäste) ───────────────────────────────────────────────────
const AllergenFilterBar = ({ excluded, onToggle, onClear }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border shadow-sm transition-all
          ${excluded.length > 0 ? "bg-yellow-400 border-yellow-400 text-gray-900" : "bg-white border-gray-200 text-gray-600 hover:border-yellow-300 hover:bg-yellow-50"}`}
      >
        <span>🥗</span>
        Allergen-Filter
        {excluded.length > 0 && <span className="font-semibold">({excluded.length} aktiv)</span>}
        <span className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="mt-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-3">Wähle aus, was du nicht verträgst — Gerichte mit diesen Allergenen werden ausgeblendet:</p>
          <div className="flex flex-wrap gap-2">
            {ALLERGEN_LIST.map(({ letter, name }) => {
              const active = excluded.includes(name);
              return (
                <button
                  key={letter}
                  onClick={() => onToggle(name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                    ${active ? "bg-yellow-400 border-yellow-400 text-gray-900" : "bg-white border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300"}`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold border shrink-0
                    ${active ? "bg-white/70 text-gray-900 border-gray-900/20" : "bg-amber-100 text-amber-800 border-amber-300"}`}
                  >
                    {letter}
                  </span>
                  ohne {name}
                </button>
              );
            })}
          </div>
          {excluded.length > 0 && (
            <button onClick={onClear} className="mt-3 text-xs text-gray-400 hover:text-gray-600 underline transition-colors">
              Filter zurücksetzen
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Allergen Badges ───────────────────────────────────────────────────────────
const ALLERGEN_LETTER = {
  Gluten: "A",
  Krebstiere: "B",
  Eier: "C",
  Fisch: "D",
  Erdnüsse: "E",
  Soja: "F",
  Milch: "G",
  Schalenfrüchte: "H",
  Sellerie: "I",
  Senf: "J",
  Sesam: "K",
  Sulfite: "L",
  Lupinen: "M",
  Weichtiere: "N",
};

const AllergenBadges = ({ ingredients }) => {
  if (!ingredients || ingredients.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {ingredients.map((ing) => (
        <span key={ing.id ?? ing.name} title={ing.name} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
          {ALLERGEN_LETTER[ing.name] ?? "?"}
        </span>
      ))}
    </div>
  );
};

// ─── Menu Section ──────────────────────────────────────────────────────────────
const RADIUS_CLASS = { none: "rounded-none", sm: "rounded-lg", md: "rounded-2xl", xl: "rounded-3xl" };
const DENSITY_TEXT = { compact: "text-sm", normal: "", airy: "text-lg" };
const DENSITY_ROW_DESKTOP = { compact: "py-2", normal: "py-4", airy: "py-6" };
const DENSITY_ROW_MOBILE = { compact: "py-2", normal: "py-3", airy: "py-5" };

const MenuSection = ({ id, title, menuItems, bgColor, fontColor, menuFont, headingFont, density = "normal", leaderDots = false, titleAlign, titleUppercase = false, cart = {}, addToCart, removeFromCart, orderMode = false, showAvailability = false, borderRadius, elevated, excludedAllergens = [], specialDishIds }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const fontStyle = menuFont ? { fontFamily: menuFont } : undefined;
  const colorStyle = fontColor ? { color: fontColor } : {};
  const headingStyle = headingFont || menuFont ? { fontFamily: headingFont || menuFont } : {};
  const rowPadDesktop = DENSITY_ROW_DESKTOP[density] ?? "py-4";
  const rowPadMobile = DENSITY_ROW_MOBILE[density] ?? "py-3";

  const visibleItems = excludedAllergens.length > 0 ? (menuItems ?? []).filter((item) => !item.ingredients?.some((ing) => excludedAllergens.includes(ing.name))) : (menuItems ?? []);
  const hiddenCount = (menuItems?.length ?? 0) - visibleItems.length;

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const CartControls = ({ item }) => {
    const qty = cart[item.id]?.quantity ?? 0;
    return (
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        {qty > 0 && (
          <>
            <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center transition-colors">
              −
            </button>
            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
          </>
        )}
        <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm flex items-center justify-center transition-colors">
          +
        </button>
      </div>
    );
  };

  return (
    <div id={id} className={`${bgColorClass(bgColor)} ${RADIUS_CLASS[borderRadius] ?? "rounded-2xl"} ${elevated === false ? "border border-gray-200" : "shadow-xl"} ${DENSITY_TEXT[density] ?? ""} w-full py-8 px-4 sm:px-6 md:px-10 transition-all scroll-mt-24`} style={bgColorStyle(bgColor)}>
      <div className="mb-8 pb-6">
        <h3 style={{ ...headingStyle, ...colorStyle, textAlign: titleAlign || "center" }} className={`text-3xl sm:text-3xl md:text-4xl font-semibold ${titleUppercase ? "uppercase tracking-widest" : "tracking-wide"}`}>
          {title}
        </h3>
      </div>

      {/* Mobile: Card-Layout */}
      <div className="block sm:hidden space-y-3">
        {visibleItems.map((item, index) => {
          const unavailable = showAvailability && item.stock === "outOfStock";
          return (
            <React.Fragment key={item.id || index}>
              <div onClick={() => !unavailable && !orderMode && toggleExpand(index)} className={`flex justify-between items-start ${rowPadMobile} border-b transition-colors ${unavailable ? "opacity-50 cursor-not-allowed" : orderMode ? "" : "cursor-pointer hover:bg-yellow-50"}`}>
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <p style={unavailable ? fontStyle : { ...fontStyle, ...colorStyle }} className={unavailable ? "text-gray-400 line-through" : "text-gray-900"}>
                      {item.name}
                    </p>
                    {unavailable && <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">Nicht verfügbar</span>}
                    {specialDishIds?.has(item.id) && <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full whitespace-nowrap">🍽️ Heute im Angebot</span>}
                    {leaderDots && !unavailable && <span aria-hidden className="flex-1 min-w-4 border-b border-dotted border-current opacity-40" style={colorStyle} />}
                  </div>
                  {item.description && (
                    <p style={unavailable ? undefined : colorStyle} className="text-sm text-gray-500 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  )}
                  <AllergenBadges ingredients={item.ingredients} />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span style={unavailable ? undefined : colorStyle} className={`font-mono whitespace-nowrap text-sm ${unavailable ? "text-gray-400 line-through" : ""}`}>
                    {parseFloat(item.price || 0).toFixed(2)}€
                  </span>
                  {orderMode && !unavailable && <CartControls item={item} />}
                </div>
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
              <TableHead style={colorStyle} className="text-left font-semibold">
                Speisen
              </TableHead>
              <TableHead style={colorStyle} className="text-right font-semibold w-28">
                Preis
              </TableHead>
              {orderMode && <TableHead className="w-32" />}
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleItems.map((item, index) => {
              const unavailable = showAvailability && item.stock === "outOfStock";
              return (
                <React.Fragment key={item.id || index}>
                  <TableRow onClick={() => !unavailable && !orderMode && toggleExpand(index)} className={`transition-all duration-200 border-b ${unavailable ? "opacity-50 cursor-not-allowed bg-gray-50" : orderMode ? "" : "cursor-pointer hover:bg-yellow-50"}`}>
                    <TableCell className={`align-top ${rowPadDesktop}`}>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span style={unavailable ? fontStyle : { ...fontStyle, ...colorStyle }} className={unavailable ? "text-gray-400 line-through" : "text-gray-900"}>
                            {item.name}
                          </span>
                          {unavailable && <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full whitespace-nowrap">Nicht verfügbar</span>}
                          {specialDishIds?.has(item.id) && <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full whitespace-nowrap">🍽️ Heute im Angebot</span>}
                          {leaderDots && !unavailable && <span aria-hidden className="flex-1 min-w-4 border-b border-dotted border-current opacity-40" style={colorStyle} />}
                        </div>
                        {item.description && (
                          <span style={unavailable ? undefined : colorStyle} className="text-sm text-gray-500 leading-relaxed">
                            {item.description}
                          </span>
                        )}
                        <AllergenBadges ingredients={item.ingredients} />
                      </div>
                    </TableCell>
                    <TableCell style={unavailable ? undefined : colorStyle} className={`text-right font-mono whitespace-nowrap align-middle ${rowPadDesktop} w-28 ${unavailable ? "text-gray-400 line-through" : ""}`}>
                      {parseFloat(item.price || 0).toFixed(2)}€
                    </TableCell>
                    {orderMode && (
                      <TableCell className={`align-middle ${rowPadDesktop} w-32`}>
                        <div className="flex justify-end">{!unavailable && <CartControls item={item} />}</div>
                      </TableCell>
                    )}
                  </TableRow>

                  {expandedIndex === index && item.imageUrl && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={orderMode ? 3 : 2} className="p-5">
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

      {hiddenCount > 0 && (
        <p className="mt-4 text-xs text-gray-400 text-center">
          {hiddenCount} {hiddenCount === 1 ? "Gericht" : "Gerichte"} durch den Allergen-Filter ausgeblendet
        </p>
      )}
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

// ─── Cart Bar ─────────────────────────────────────────────────────────────────
const CartBar = ({ cart, onOrder }) => {
  const items = Object.values(cart);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl px-4 py-3 flex items-center justify-between gap-4">
      <div className="text-sm text-gray-700">
        <span className="font-semibold">{items.reduce((s, i) => s + i.quantity, 0)} Artikel</span>
        <span className="mx-2 text-gray-300">|</span>
        <span className="font-mono">{total.toFixed(2)} €</span>
      </div>
      <button onClick={onOrder} className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-gray-700 transition-colors">
        Bestellen →
      </button>
    </div>
  );
};

// ─── Order Modal ───────────────────────────────────────────────────────────────
const OrderModal = ({ cart, tableNumber, restaurantId, onSuccess, onClose }) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const items = Object.values(cart);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          tableNumber,
          items: items.map((i) => ({ dishId: i.dishId, name: i.name, price: i.price, quantity: i.quantity })),
          note: note || null,
        }),
      });
      const data = await res.json();
      if (res.ok) onSuccess(data.orderId);
      else alert("Fehler beim Bestellen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <h2 className="text-lg font-semibold">Bestellung bestätigen</h2>
        <p className="text-sm text-gray-500">Tisch {tableNumber}</p>

        <ul className="space-y-1 text-sm border rounded-xl p-3 bg-gray-50">
          {items.map((i) => (
            <li key={i.dishId} className="flex justify-between">
              <span>
                {i.quantity}× {i.name}
              </span>
              <span className="font-mono text-gray-600">{(i.price * i.quantity).toFixed(2)} €</span>
            </li>
          ))}
          <li className="flex justify-between font-semibold pt-2 border-t mt-2">
            <span>Gesamt</span>
            <span className="font-mono">{total.toFixed(2)} €</span>
          </li>
        </ul>

        <div>
          <label className="text-sm font-medium text-gray-700">Anmerkung (optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="z.B. ohne Zwiebeln..." className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-400" />
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            Abbrechen
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-gray-900 text-white rounded-xl py-2 text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50">
            {loading ? "Wird gesendet..." : "Jetzt bestellen"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── QR Modal ─────────────────────────────────────────────────────────────────
const QRModal = ({ orderId, tableNumber, googleReviewUrl, onClose }) => {
  const url = typeof window !== "undefined" ? `${window.location.origin}/orders/${orderId}` : `/orders/${orderId}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-center">
        <h2 className="text-lg font-semibold">Bestellung aufgegeben!</h2>
        <p className="text-sm text-gray-500">Tisch {tableNumber} · Zeige diesen QR-Code der Bedienung</p>
        <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
          <QRCodeSVG value={url} size={180} />
        </div>
        <p className="text-xs text-gray-400">Die Bedienung scannt den Code um deine Bestellung zu sehen</p>
        {googleReviewUrl && (
          <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-yellow-50 border border-yellow-300 hover:bg-yellow-100 text-gray-900 rounded-xl py-2 text-sm font-semibold transition-colors">
            ⭐ Gefällt es dir hier? Bewerte uns auf Google
          </a>
        )}
        <button onClick={onClose} className="w-full bg-gray-900 text-white rounded-xl py-2 text-sm font-semibold hover:bg-gray-700 transition-colors">
          Schließen
        </button>
      </div>
    </div>
  );
};

// ─── Main Content ──────────────────────────────────────────────────────────────
// Daten kommen als Prop von der Server-Seite (ISR) — hier kein Fetch mehr
const MenuClient = ({ serverData }) => {
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState(null);
  const [activePage, setActivePage] = useState("menu");

  const tableNumber = searchParams.get("tableNumber");
  // Bestellmodus nur für Professional-Restaurants — gleiche Regel wie serverseitig
  // in getStaffAccess (api/orders/create), sonst zeigt die UI Buttons, die beim
  // Abschicken ohnehin mit 401 abgelehnt würden.
  const orderMode = !!tableNumber && serverData?.ownerSubscription === "Professional";
  const [cart, setCart] = useState({});
  const [excludedAllergens, setExcludedAllergens] = useState([]);

  const toggleAllergen = useCallback((name) => {
    setExcludedAllergens((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }, []);
  const [orderStep, setOrderStep] = useState(null); // null | "confirm" | "qr"
  const [orderId, setOrderId] = useState(null);

  const addToCart = useCallback((dish) => {
    setCart((prev) => {
      const existing = prev[dish.id];
      return { ...prev, [dish.id]: { dishId: dish.id, name: dish.name, price: parseFloat(dish.price), quantity: (existing?.quantity ?? 0) + 1 } };
    });
  }, []);

  const removeFromCart = useCallback((dishId) => {
    setCart((prev) => {
      const existing = prev[dishId];
      if (!existing || existing.quantity <= 1) {
        const { [dishId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dishId]: { ...existing, quantity: existing.quantity - 1 } };
    });
  }, []);

  const name = serverData?.name || "Unbenanntes Restaurant";
  const menuEntry = serverData?.menu?.[0];
  const bgColor = menuEntry?.bgColor;
  const menuFont = menuEntry?.font || null;
  const headingFont = menuEntry?.headingFont || null;
  const density = menuEntry?.density || "normal";
  const heroColor = menuEntry?.heroColor;
  const categoryGroups = menuEntry?.categoryGroup ?? [];
  const showAvailability = ["Professional", "Business"].includes(serverData?.ownerSubscription);
  const calendarEntries = showAvailability ? (serverData?.calendar ?? []) : [];
  const specialDishIds = new Set(calendarEntries.filter((e) => e.type === "specialDish" && e.dishId).map((e) => e.dishId));

  const restaurantId = serverData?.id;

  return (
    <div className={`min-h-screen flex flex-col text-gray-900 font-sans ${bgColor ? bgColorClass(bgColor) : "bg-amber-50"}`} style={{ ...bgColorStyle(bgColor), fontFamily: menuFont || undefined }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {menuFont && <link href={GOOGLE_FONTS_URL} rel="stylesheet" />}
      <Header name={name} activePage={activePage} setActivePage={setActivePage} hasEvents={calendarEntries.length > 0} eventCount={calendarEntries.length} />
      <HeroSection restaurantData={serverData} menuFont={menuFont} color={heroColor} />
      {activePage === "menu" && categoryGroups.length > 0 && <CategoryNav categories={categoryGroups.flatMap((g) => g.categories ?? [])} activeId={activeId} />}

      {activePage === "info" ? (
        <InfoPage restaurantData={serverData} />
      ) : activePage === "events" ? (
        <EventsPage entries={calendarEntries} />
      ) : (
        <>
          <main className={`w-full max-w-7xl mx-auto px-4 py-8 ${orderMode ? "pb-28" : ""}`}>
            {orderMode && (
              <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2 w-fit shadow-sm">
                <span>🪑</span>
                <span>
                  Tisch <strong className="text-gray-900">{tableNumber}</strong> · Wähle deine Gerichte aus
                </span>
              </div>
            )}
            <AllergenFilterBar excluded={excludedAllergens} onToggle={toggleAllergen} onClear={() => setExcludedAllergens([])} />
            {categoryGroups.length > 0 ? (
              <div className="space-y-12">
                {categoryGroups.map((group) => (
                  <div key={group.id} className={`${RADIUS_CLASS[group.borderRadius] ?? "rounded-2xl"} shadow-sm p-6 border border-amber-100 ${bgColorClass(group.color) || "bg-white"}`} style={bgColorStyle(group.color)}>
                    <h2 style={{ ...(headingFont || menuFont ? { fontFamily: headingFont || menuFont } : {}), ...(group.fontColor ? { color: group.fontColor } : {}), textAlign: group.titleAlign ?? "left" }} className="text-2xl font-semibold mb-6 pb-2">
                      {group.name}
                    </h2>
                    <div className="space-y-8">
                      {group.categories?.map((category) => (
                        <MenuSection key={category.id} id={category.id} title={category.name} menuItems={category.dishes} bgColor={category.bgColor} fontColor={category.fontColor} menuFont={menuFont} headingFont={headingFont} density={density} leaderDots={category.leaderDots} titleAlign={category.titleAlign} titleUppercase={category.titleUppercase} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} orderMode={orderMode} showAvailability={showAvailability} borderRadius={category.borderRadius} elevated={category.elevated} excludedAllergens={excludedAllergens} specialDishIds={specialDishIds} />
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

      {orderMode && <CartBar cart={cart} onOrder={() => setOrderStep("confirm")} />}

      {orderStep === "confirm" && (
        <OrderModal
          cart={cart}
          tableNumber={tableNumber}
          restaurantId={restaurantId}
          onSuccess={(id) => {
            setOrderId(id);
            setOrderStep("qr");
            setCart({});
          }}
          onClose={() => setOrderStep(null)}
        />
      )}

      {orderStep === "qr" && <QRModal orderId={orderId} tableNumber={tableNumber} googleReviewUrl={serverData?.socialLinks?.google} onClose={() => setOrderStep(null)} />}
    </div>
  );
};

export default MenuClient;
