import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const origin = req.headers.get("origin");
  if (origin && origin !== "http://localhost:3000") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // 🔑 nur Secret aus ENV — kein authOptions!
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname.startsWith("/Protected") && !token) return NextResponse.redirect(new URL("/login", req.url));

  if (pathname.startsWith("/Admin")) {
    if (!token || token.role !== "Admin") return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/Profil")) {
    if (!token || token.role !== "Owner") return NextResponse.redirect(new URL("/", req.url));
  }

  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
