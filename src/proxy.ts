import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Protected page routes (require authenticated session) ─────────────────
const PROTECTED_ROUTES = [
  "/dashboard",
  "/resumes",
  "/resume-builder",
  "/resume-analyzer",
  "/interview",
  "/editor",
  "/chat",
];

// ── Login redirect target ─────────────────────────────────────────────────
const LOGIN_PATH = "/login";

// ── Routes that authenticated users should NOT visit (redirect to dashboard) ─
const AUTH_ROUTES = ["/login", "/register"];

/**
 * Next.js 16 Proxy — runs before every matched request.
 *
 * 1. Route Protection: Checks for Better-Auth session cookie on protected pages.
 *    If missing → redirect to /login with a `callbackUrl` query parameter.
 * 2. Auth Route Guard: If user IS authenticated and tries to visit /login or /register,
 *    redirect them to /dashboard instead.
 * 3. Security Headers: Adds standard security headers to all responses.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Check session cookie presence ────────────────────────────────────
  // Better-Auth stores session in `better-auth.session_token` cookie.
  // We check cookie existence here (lightweight, no DB call).
  // Full session validation happens in the API route handlers via auth.api.getSession().
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthenticated = !!sessionToken;

  // ── 2. Protect authenticated routes ─────────────────────────────────────
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Redirect authenticated users away from auth pages ────────────────
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── 4. Continue with security headers ───────────────────────────────────
  const response = NextResponse.next();

  // Standard security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

// ── Matcher: only run proxy on page routes and API routes ────────────────
// Excludes static files, image optimization, and public assets.
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder assets (images, uploads, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|uploads/).*)",
  ],
};
