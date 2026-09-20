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
};

export default nextConfig;
