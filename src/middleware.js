import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROOT_DOMAIN, SUBDOMAIN_PATTERN, RESERVED_SUBDOMAINS, subdomainFromHostname } from "@/lib/schemas/subdomain";

// Host der Hauptseite (siehe metadataBase in den Root-Layouts)
const MAIN_HOST = process.env.NODE_ENV === "production" ? `www.${ROOT_DOMAIN}` : ROOT_DOMAIN;

function getSubdomain(req) {
  return subdomainFromHostname(req.headers.get("x-original-host") ?? req.headers.get("host"));
}

function rootUrl(req, pathname) {
  const url = new URL(pathname, req.url);
  url.hostname = MAIN_HOST;
  return url;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const subdomain = getSubdomain(req);

  // ── Restaurant-Subdomain: <subdomain>.whatisonmymenu.com ──────────────────────
  // API-Aufrufe (z. B. /api/orders/create von der Speisekarte) laufen auch auf der Subdomain
  // weiter unten durch die normalen Rollenprüfungen — /api/Admin bleibt also geschützt.
  if (subdomain && !pathname.startsWith("/api/")) {
    // Startseite der Subdomain zeigt die Speisekarte, URL bleibt erhalten.
    // Ob es die Subdomain gibt, prüft die Seite selbst (sonst 404).
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/sub/${subdomain}`, req.url));
    }

    return NextResponse.redirect(rootUrl(req, pathname + req.nextUrl.search));
  }

  if (!subdomain && pathname.startsWith("/sub/")) {
    const sub = pathname.slice("/sub/".length).split("/")[0].toLowerCase();
    if (SUBDOMAIN_PATTERN.test(sub) && !RESERVED_SUBDOMAINS.has(sub)) {
      const url = rootUrl(req, "/");
      url.hostname = `${sub}.${ROOT_DOMAIN}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (process.env.NODE_ENV === "production" && pathname.startsWith("/ErstelleRestaurantAccount/Professional")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isAdmin = pathname.startsWith("/Admin") || pathname.startsWith("/api/Admin") || pathname.startsWith("/api/restaurant/Admin");
  const isProfil = pathname.startsWith("/Profil");
  const isStaffArea = pathname.startsWith("/staff") || pathname.startsWith("/settings");

  // Token nur dort lesen, wo es gebraucht wird; die Middleware läuft jetzt auf allen Seiten.
  if (!isAdmin && !isProfil && !isStaffArea) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // /Admin, /api/Admin, /api/restaurant/Admin — nur Admin
  if (isAdmin && token?.role !== "Admin") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // /Profil — nur Owner
  if (isProfil && token?.role !== "Owner") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // /staff, /settings — Owner und Staff
  if (isStaffArea && token?.role !== "Owner" && token?.role !== "Staff") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

  // Überall außer Next-Interna und statischen Dateien, damit Subdomains auf jedem Pfad greifen.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|txt|xml)$).*)"],
};
