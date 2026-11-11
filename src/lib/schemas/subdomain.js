import { z } from "zod";

// Regeln für Restaurant-Subdomains (<subdomain>.whatisonmymenu.com).
// Gemeinsam genutzt von Middleware, API und Profil-Editor, damit überall dieselbe Regel gilt.

// 3–63 Zeichen, nur a-z, 0-9 und Bindestrich, Bindestrich nicht am Anfang oder Ende
export const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])$/;

// Eigene Subdomain ist ein Premium-Feature
export const SUBDOMAIN_SUBSCRIPTIONS = ["Professional", "Business"];

// Werden nie als Restaurant vergeben bzw. aufgelöst
export const RESERVED_SUBDOMAINS = new Set([
  "www", "api", "app", "admin", "mail", "smtp", "ftp", "staging", "dev", "test", "demo",
  "static", "assets", "cdn", "img", "images", "blog", "help", "support", "status",
  "dashboard", "login", "auth", "account", "konto", "profil", "staff", "pricing", "sub",
]);

// Hauptdomain ohne "www". Lokal funktionieren Subdomains über <subdomain>.localhost:3000.
export const ROOT_DOMAIN = process.env.NODE_ENV === "production" ? "whatisonmymenu.com" : "localhost";

/**
 * Restaurant-Subdomain aus einem Hostnamen, sonst null.
 * "pizza.whatisonmymenu.com" -> "pizza"   "www.whatisonmymenu.com" -> null
 * Genutzt von der Middleware (Rewrite) und von Providers.js im Browser
 * (dort ohne Session-Abfrage für Gäste) — beide müssen dieselbe Regel haben.
 */
export function subdomainFromHostname(rawHostname) {
  // Port abschneiden und klein schreiben ("Pizza.localhost:3000" -> "pizza.localhost")
  const hostname = String(rawHostname ?? "").split(":")[0].toLowerCase();
  // Nur echte Subdomains der eigenen Domain. Vercel-Preview-Hosts o. Ä. fallen hier raus.
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) return null;

  const sub = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
  // Mehrstufige Subdomains (a.b.whatisonmymenu.com) und reservierte Namen ignorieren
  if (sub.includes(".") || RESERVED_SUBDOMAINS.has(sub) || !SUBDOMAIN_PATTERN.test(sub)) return null;
  return sub;
}

export const subdomainSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Mindestens 3 Zeichen")
  .max(63, "Höchstens 63 Zeichen")
  .regex(SUBDOMAIN_PATTERN, "Nur Kleinbuchstaben, Ziffern und Bindestriche, kein Bindestrich am Anfang oder Ende")
  .refine((value) => !RESERVED_SUBDOMAINS.has(value), "Diese Subdomain ist reserviert");
