import { NextResponse } from "next/server";
import { rotateRefreshToken, signAccessToken } from "@/lib/auth";
import {
  readRefreshCookie,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { errorResponse, Unauthorized } from "@/lib/errors";

export async function POST() {
  try {
    const raw = readRefreshCookie();
    if (!raw) throw Unauthorized("No refresh token");

    const result = await rotateRefreshToken(raw);
    if (!result) {
      clearAuthCookies();
      throw Unauthorized("Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: { id: true, role: true },
    });
    if (!user) {
      clearAuthCookies();
      throw Unauthorized("User not found");
    }

    const access = await signAccessToken({ sub: user.id, role: user.role });
    setAuthCookies(access, result.refresh);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const { status, body } = errorResponse(e);
    return NextResponse.json(body, { status });
  }
}
import { NextResponse } from "next/server";
import { rotateRefreshToken, signAccessToken } from "@/lib/auth";
import {
  readRefreshCookie,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { errorResponse, Unauthorized } from "@/lib/errors";

export async function POST() {
  try {
    const raw = await readRefreshCookie();
    if (!raw) throw Unauthorized("No refresh token");

    const result = await rotateRefreshToken(raw);
    if (!result) {
      await clearAuthCookies();
      throw Unauthorized("Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: { id: true, role: true },
    });
    if (!user) {
      await clearAuthCookies();
      throw Unauthorized("User not found");
    }

    const access = await signAccessToken({ sub: user.id, role: user.role });
    await setAuthCookies(access, result.refresh);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const { status, body } = errorResponse(e);
    return NextResponse.json(body, { status });
  }
}