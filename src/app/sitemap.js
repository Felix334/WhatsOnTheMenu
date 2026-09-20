import { locales, localizedPath, defaultLocale, xDefaultLocale } from "@/i18n/config";

// Trailing Slash abschneiden: sonst entstehen URLs wie ".../<double-slash>pricing",
// die weiterleiten — und genau solche Sitemap-Eintraege meldet die Search
// Console als "Seite mit Weiterleitung".
const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://www.whatisonmymenu.com").replace(/\/+$/, "");

// Seiten, die es in allen Sprachen gibt. Sie bekommen pro Sprache einen eigenen
// Eintrag samt alternates — so findet Google die uebersetzten Fassungen, ohne
// erst dem Sprachumschalter folgen zu muessen.
const TRANSLATED_PAGES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/WieFunktionierts", changeFrequency: "monthly", priority: 0.8 },
  { path: "/UnserTeam", changeFrequency: "monthly", priority: 0.5 },
];

// Nur auf Deutsch vorhanden: Rechtsseiten (Dokumente nach deutschem Recht) und
// die Team-Seite. Diese bekommen bewusst kein hreflang — es gibt keine
// uebersetzte Entsprechung, auf die es zeigen koennte.
const GERMAN_ONLY_PAGES = [
  { path: "/AGBs", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/Impressum", changeFrequency: "yearly", priority: 0.3 },
  { path: "/Widerruf", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap() {
  const lastModified = new Date();

  const translated = TRANSLATED_PAGES.flatMap(({ path, changeFrequency, priority }) => {
    // hreflang-Block: fuer jede Sprache die passende URL, plus x-default auf
    // die englische Fassung (Auffang fuer alle uebrigen Sprachen). Identisch
    // fuer alle Sprachvarianten einer Seite — genau so erwartet Google es.
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

  const germanOnly = GERMAN_ONLY_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  return [...translated, ...germanOnly];
}
