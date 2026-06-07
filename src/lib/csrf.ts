/**
 * CSRF Protection — Origin / Referer header validation.
 *
 * For mutating API requests (POST, PUT, PATCH, DELETE) we verify that
 * the Origin (or Referer) header matches one of our allowed origins.
 * This prevents cross-origin form submissions and AJAX-based CSRF attacks.
 *
 * Usage in API routes:
 *   import { verifyCsrfOrigin } from "@/lib/csrf";
 *   const csrfResult = verifyCsrfOrigin(req);
 *   if (csrfResult) return csrfResult; // returns 403 if invalid
 */

import { NextResponse } from "next/server";

function getAllowedOrigins(): string[] {
  const origins = ["http://localhost:3000", "http://127.0.0.1:3000"];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    origins.push(appUrl);
    // Also allow without trailing slash
    origins.push(appUrl.replace(/\/$/, ""));
  }

  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl && !origins.includes(nextAuthUrl)) {
    origins.push(nextAuthUrl);
  }

  return origins;
}

/**
 * Verifies that the request Origin header matches an allowed origin.
 * Returns a 403 NextResponse if the check fails, or null if it passes.
 *
 * Skip this check for:
 * - GET / HEAD / OPTIONS requests (safe methods)
 * - Requests without Origin that have valid Referer
 * - Webhook endpoints (they use their own signature verification)
 */
export function verifyCsrfOrigin(req: Request): NextResponse | null {
  const method = req.method.toUpperCase();

  // Safe methods don't need CSRF protection
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return null;
  }

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const allowed = getAllowedOrigins();

  // If Origin header is present, validate it
  if (origin) {
    if (allowed.some((a) => origin === a || origin === a.replace(/\/$/, ""))) {
      return null; // Valid origin
    }
    return NextResponse.json(
      { error: "Forbidden: invalid origin" },
      { status: 403 }
    );
  }

  // Fall back to Referer header if no Origin
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (allowed.some((a) => refererOrigin === new URL(a).origin)) {
        return null; // Valid referer
      }
    } catch {
      // malformed referer
    }
    return NextResponse.json(
      { error: "Forbidden: invalid referer" },
      { status: 403 }
    );
  }

  // No Origin or Referer — could be a server-to-server call or mobile.
  // For API routes called by mobile apps, they should use Bearer tokens.
  // We allow requests without Origin/Referer only if they have an Authorization header.
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    return null;
  }

  // Block requests with no origin information at all
  return NextResponse.json(
    { error: "Forbidden: missing origin" },
    { status: 403 }
  );
}
