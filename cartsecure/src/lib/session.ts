import { cookies } from "next/headers";

export const ACCESS_COOKIE = "cs_at";
export const REFRESH_COOKIE = "cs_rt";

const isProd = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict" as const,
  path: "/",
};

export function setAuthCookies(access: string, refresh: string): void {
  const c = cookies();
  c.set(ACCESS_COOKIE, access, { ...baseCookieOptions, maxAge: 60 * 15 });
  c.set(REFRESH_COOKIE, refresh, {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookies(): void {
  const c = cookies();
  c.set(ACCESS_COOKIE, "", { ...baseCookieOptions, maxAge: 0 });
  c.set(REFRESH_COOKIE, "", { ...baseCookieOptions, maxAge: 0 });
}

export function readAccessCookie(): string | undefined {
  return cookies().get(ACCESS_COOKIE)?.value;
}

export function readRefreshCookie(): string | undefined {
  return cookies().get(REFRESH_COOKIE)?.value;
}