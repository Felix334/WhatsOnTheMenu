import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (pathname.startsWith("/Admin") || pathname.startsWith("/api/Admin")) {
    if (!token || token.role !== "Admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/Profil")) {
    if (!token || token.role !== "Owner") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Admin/:path*",
    "/api/Admin/:path*",
    "/api/restaurant/Admin/:path*",   // ← fehlte: Restaurant-Genehmigungs-Routen
    "/Profil/:path*",
  ],
};