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

export async function setAuthCookies(
  access: string,
  refresh: string
): Promise<void> {
  const c = await cookies();
  c.set(ACCESS_COOKIE, access, { ...baseCookieOptions, maxAge: 60 * 15 });
  c.set(REFRESH_COOKIE, refresh, {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const c = await cookies();
  c.set(ACCESS_COOKIE, "", { ...baseCookieOptions, maxAge: 0 });
  c.set(REFRESH_COOKIE, "", { ...baseCookieOptions, maxAge: 0 });
}

export async function readAccessCookie(): Promise<string | undefined> {
  const c = await cookies();
  return c.get(ACCESS_COOKIE)?.value;
}

export async function readRefreshCookie(): Promise<string | undefined> {
  const c = await cookies();
  return c.get(REFRESH_COOKIE)?.value;
}