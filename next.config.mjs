/** @type {import('next').NextConfig} */

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

  // Sprach-Rewrites und -Weiterleitungen (/how-it-works -> /en/WieFunktionierts,
  // /en/pricing -> /pricing, ...) macht die Middleware ueber resolveLocaleRoute
  // aus src/i18n/config.js — nicht hier. Die Standardsprache laeuft ohne
  // Praefix, das laesst sich mit statischen Regeln nicht sauber abbilden.

  // Umbenannte Dashboard-Pfade (deutsch -> englisch). Alte Links und
  // Lesezeichen landen per 308 auf dem neuen Pfad; Query-Strings (restaurantID)
  // reicht Next automatisch durch. Jedes Ziel muss hinter der Rollenpruefung
  // der Middleware liegen (/staff bzw. /dashboard).
  // Reihenfolge: spezielle Pfade vor der Sammelregel /Profil/:path*, und
  // direkt aufs Endziel — keine Weiterleitungsketten.
  async redirects() {
    return [
      { source: "/staff/bestellungen", destination: "/staff/orders", permanent: true },
      { source: "/Profil/Bestellungen", destination: "/dashboard/orders", permanent: true },
      { source: "/Profil/Drucken", destination: "/dashboard/print", permanent: true },
      { source: "/Profil/QRBuilder", destination: "/dashboard/qr-codes", permanent: true },
      { source: "/Profil", destination: "/dashboard", permanent: true },
      { source: "/Profil/:path*", destination: "/dashboard/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
