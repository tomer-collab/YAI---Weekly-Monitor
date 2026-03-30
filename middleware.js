/**
 * Middleware — runs BEFORE any page loads.
 *
 * If the user is not logged in, they get redirected to /login.
 * If they ARE logged in, the page loads normally.
 *
 * This runs on the server (Vercel Edge) so it cannot be bypassed
 * by disabling JavaScript or inspecting the page source.
 */

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Allow access to: login page, auth API routes, static files
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // If not logged in, redirect to login page
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated — allow access
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
