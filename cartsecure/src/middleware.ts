import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_COOKIE = "cs_at";

const PROTECTED = ["/dashboard", "/orders", "/seller", "/admin", "/wallet"];const PUBLIC_API = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/seller/scan",
  "/api/security/events",
];

const accessSecret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-only-access-secret-change-me"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'; frame-ancestors 'none'"
  );

  const needsAuth =
    PROTECTED.some((p) => pathname.startsWith(p)) ||
    (pathname.startsWith("/api/") && !PUBLIC_API.some((p) => pathname.startsWith(p)));

  if (!needsAuth) return res;

  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return deny(req);

  try {
    const { payload } = await jwtVerify(token, accessSecret, {
      issuer: "cartsecure",
      audience: "cartsecure-web",
    });
    res.headers.set("x-user-id", String(payload.sub));
    res.headers.set("x-user-role", String(payload.role));
    return res;
  } catch {
    return deny(req);
  }
}

function deny(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "unauthorized", code: "unauthorized" },
      { status: 401 }
    );
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};