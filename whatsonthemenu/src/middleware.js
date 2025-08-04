import { NextRequest, NextResponse } from "next/server";

export function middleware(req) { // Route Rewrite mit middlware duch file name ersetzt(fürs erste)
  console.log(`Middleware-Log:[${new Date().toISOString()}] ${req.method} ${req.url}`);
}


