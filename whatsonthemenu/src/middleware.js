import { NextRequest, NextResponse } from "next/server";

export function middleware(req) {
  console.log(`Middleware-Log(middleware.js):[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  const url = req.nextUrl.clone();
  const id = url.searchParams.get("userID");

  
  /*if (url.pathname.startsWith("/Routes")) {
    const newPath = url.pathname.replace('/Routes', '');
    return NextResponse.push(new URL(newPath, req.url));
  }*/














// Wenn die userID in the url ist kann ich nicht mehr mit den Browserpfeilen navigieren
// aber wenn nicht dann schon





























  // If there's no userID and the path matches specific routes
  if (!id) {
    if (
      url.pathname.startsWith("/Routes/UnserePartner/") ||
      url.pathname.startsWith("/Routes/UnserTeam/") ||
      url.pathname.startsWith("/Routes/WieFunktionierts/")
    ) {
      const newPath = url.pathname.replace('/Routes/', '/');
      return NextResponse.push(new URL(newPath, req.url));
    }

    // If userID is present in the search params, remove it and redirect to the home page
    if (url.searchParams.has("userID")) {
      url.searchParams.delete("userID");
      return NextResponse.push(new URL("/", req.url));
    }
  }else{}

  // Proceed to the next middleware or request handler
  return NextResponse.next();
}

export const config = {
  matcher: "/Routes/:path*", // Match all paths under /Routes
};
