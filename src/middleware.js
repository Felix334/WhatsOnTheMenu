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

  if (process.env.NODE_ENV === "production") {
    if (pathname.startsWith("/ErstelleRestaurantAccount/Professional")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // /staff/* — nur Staff und Owner
  if (pathname.startsWith("/staff")) {
    if (!token || (token.role !== "Staff" && token.role !== "Owner")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // /settings — Owner und Staff
  if (pathname.startsWith("/settings")) {
    if (!token || (token.role !== "Owner" && token.role !== "Staff")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Admin/:path*", "/api/Admin/:path*", "/api/restaurant/Admin/:path*", "/Profil/:path*", "/staff/:path*", "/staff", "/settings/:path*", "/settings", "/ErstelleRestaurantAccount/Professional/:path*", "/ErstelleRestaurantAccount/Professional"],
};
