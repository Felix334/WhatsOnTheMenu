import { NextRequest, NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const id = url.searchParams.get('id');

  if (url.pathname.startsWith('/Routes')) {
    if (id) {
      // If the id param is missing in the current URL, add it
      if (!req.nextUrl.searchParams.has('id')) {
        url.searchParams.set('id', id);
        return NextResponse.redirect(url);
      }
      // Allow the request to continue if id param exists
      return NextResponse.next();
    } else {
      // If no id param and trying to access /Routes, redirect to login or root
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // For other requests, continue as normal
  return NextResponse.next();
}
