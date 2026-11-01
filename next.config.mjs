/** @type {import('next').NextConfig} */

import { LOCALIZED_PATHS } from "./src/i18n/slugs.mjs";

// [{ locale, neutral: "/WieFunktionierts", localized: "/how-it-works" }, ...]
const localizedPaths = Object.entries(LOCALIZED_PATHS).flatMap(([locale, paths]) =>
  Object.entries(paths).map(([neutral, localized]) => ({ locale, neutral, localized }))
);

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
      .replace(/\s{2,}/g, " ")
      .trim(),
  },
];

const nextConfig = {
  // Erlaubt einen Produktions-Build, waehrend `next dev` laeuft: beide
  // schreiben sonst in .next und zerschiessen sich gegenseitig die
  // Ausgabe ("Cannot find module for page: ..." bei wechselnden Seiten).
  // Ohne die Variable bleibt es beim Standard .next — Vercel ist nicht betroffen.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Alte Pfade mit deutschem Namen (/en/WieFunktionierts) dauerhaft auf den
  // uebersetzten Pfad umleiten — Google uebernimmt so die bereits gecrawlte URL.
  // Query-Strings reicht Next automatisch durch.
  async redirects() {
    return localizedPaths.map(({ locale, neutral, localized }) => ({
      source: `/${locale}${neutral}`,
      destination: `/${locale}${localized}`,
      permanent: true,
    }));
  },

  // Uebersetzter Pfad -> bestehender Seitenordner unter (intl)/[locale]/.
  // Redirects werden nur fuer die eingehende URL ausgewertet, daher keine Schleife.
  async rewrites() {
    return localizedPaths.map(({ locale, neutral, localized }) => ({
      source: `/${locale}${localized}`,
      destination: `/${locale}${neutral}`,
    }));
  },
};

export default nextConfig;
