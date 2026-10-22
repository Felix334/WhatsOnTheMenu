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

export const subdomainSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Mindestens 3 Zeichen")
  .max(63, "Höchstens 63 Zeichen")
  .regex(SUBDOMAIN_PATTERN, "Nur Kleinbuchstaben, Ziffern und Bindestriche, kein Bindestrich am Anfang oder Ende")
  .refine((value) => !RESERVED_SUBDOMAINS.has(value), "Diese Subdomain ist reserviert");
