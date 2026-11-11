import { locales, localizedPath, defaultLocale, xDefaultLocale } from "@/i18n/config";

// Trailing Slash abschneiden: sonst entstehen URLs wie ".../<double-slash>pricing",
// die weiterleiten — und genau solche Sitemap-Eintraege meldet die Search
// Console als "Seite mit Weiterleitung".
const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://www.whatisonmymenu.com").replace(/\/+$/, "");

// Seiten, die es in allen Sprachen gibt. Sie bekommen pro Sprache einen eigenen
// Eintrag samt alternates — so findet Google die uebersetzten Fassungen, ohne
// erst dem Sprachumschalter folgen zu muessen.
//
// lastModified: Datum der letzten INHALTLICHEN Aenderung, von Hand gepflegt.
// Nicht new Date() — sonst traegt jeder Deploy ueberall "heute" ein, Google
// merkt, dass das Feld nicht stimmt, und ignoriert es dann fuer die ganze
// Domain. Beim Aendern von Seitentext hier das Datum mitziehen; reine
// Code-Umbauten ohne sichtbare Aenderung zaehlen nicht.
const TRANSLATED_PAGES = [
  { path: "/", lastModified: "2026-11-09", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", lastModified: "2026-10-22", changeFrequency: "monthly", priority: 0.9 },
  { path: "/WieFunktionierts", lastModified: "2026-09-20", changeFrequency: "monthly", priority: 0.8 },
  { path: "/UnserTeam", lastModified: "2026-11-11", changeFrequency: "monthly", priority: 0.5 },
];

// Nur auf Deutsch vorhanden: Rechtsseiten (Dokumente nach deutschem Recht).
// Diese bekommen bewusst kein hreflang — es gibt keine uebersetzte
// Entsprechung, auf die es zeigen koennte.
const GERMAN_ONLY_PAGES = [
  { path: "/AGBs", lastModified: "2026-09-20", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", lastModified: "2026-09-20", changeFrequency: "yearly", priority: 0.3 },
  { path: "/Impressum", lastModified: "2026-09-20", changeFrequency: "yearly", priority: 0.3 },
  { path: "/Widerruf", lastModified: "2026-09-20", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap() {
  const translated = TRANSLATED_PAGES.flatMap(({ path, lastModified, changeFrequency, priority }) => {
    const languages = Object.fromEntries(locales.map((l) => [l, `${baseUrl}${localizedPath(path, l)}`]));

    return locales.map((locale) => ({
      url: `${baseUrl}${localizedPath(path, locale)}`,
      lastModified,
      changeFrequency,
      priority: locale === defaultLocale ? priority : priority - 0.1,
      alternates: {
        languages: { ...languages, "x-default": `${baseUrl}${localizedPath(path, xDefaultLocale)}` },
      },
    }));
  });

  const germanOnly = GERMAN_ONLY_PAGES.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  return [...translated, ...germanOnly];
}
