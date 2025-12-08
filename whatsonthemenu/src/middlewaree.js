import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth";
import { headers } from "next/headers";

export async function middleware(req) {

  const { pathname } = req.nextUrl;


  console.log(`Middleware-Log: [${new Date().toISOString()}] ${req.method} ${req.url}`);
  try{
    const origin = (await headers()).get('origin');
    if(origin !== 'http://localhost:3000'){












//?






      console.log("Unauthorized Access")
      return NextResponse.json({error: 'Unauthorized'}, {status: 403})
    }
  }catch(err){
    console.log(err)
  }
  try {
    // Protect routes under /Protected
    if (pathname.startsWith("/Protected")) {
      const session = await getServerSession(authOptions, req);
      if (!session) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Security headers
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    // Add CSP if needed: response.headers.set("Content-Security-Policy", "default-src 'self'");

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next(); // Continue on error
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Apply to most routes, exclude static files
};
