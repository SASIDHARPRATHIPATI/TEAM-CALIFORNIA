import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/schemas/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signAccessToken, issueRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import { authLimit, safeLimit } from "@/lib/ratelimit";
import { errorResponse, AppError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rl = await safeLimit(authLimit, `login:${ip}`);
    if (!rl.success) {
      await writeAudit({
        action: "auth.login_rate_limited",
        severity: "MEDIUM",
        metadata: { ip },
      });
      throw new AppError(429, "rate_limited", "Too many attempts");
    }

    const { email, password } = LoginSchema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email } });
    const ok = user ? await verifyPassword(user.passwordHash, password) : false;

    if (!user || !ok) {
      await writeAudit({
        userId: user?.id ?? null,
        action: "auth.login_failed",
        severity: "MEDIUM",
        metadata: { email },
      });
      throw new AppError(401, "unauthorized", "Invalid credentials");
    }

    const access = await signAccessToken({ sub: user.id, role: user.role });
    const refresh = await issueRefreshToken(user.id);
    setAuthCookies(access, refresh);

    await writeAudit({
      userId: user.id,
      action: "auth.login",
      severity: "LOW",
      metadata: { email: user.email, role: user.role },
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (e) {
    const { status, body } = errorResponse(e);
    return NextResponse.json(body, { status });
  }
}