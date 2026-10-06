import { NextRequest, NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, signAccessToken, issueRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/session";
import { writeAudit } from "@/lib/audit";
import { authLimit, safeLimit } from "@/lib/ratelimit";
import { errorResponse, AppError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rl = await safeLimit(authLimit, `register:${ip}`);
    if (!rl.success) {
      await writeAudit({
        action: "auth.register_rate_limited",
        severity: "MEDIUM",
        metadata: { ip },
      });
      throw new AppError(429, "rate_limited", "Too many attempts");
    }

    const body = RegisterSchema.parse(await req.json());

    const existing = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true },
    });
    if (existing) {
      throw new AppError(400, "bad_request", "Email already registered");
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        role: body.role,
        passwordHash: await hashPassword(body.password),
        wallet: { create: { balance: 15000, escrow: 0 } },
      },
      select: { id: true, email: true, name: true, role: true },
    });

    const access = await signAccessToken({ sub: user.id, role: user.role });
    const refresh = await issueRefreshToken(user.id);
    await setAuthCookies(access, refresh);

    await writeAudit({
      userId: user.id,
      action: "auth.register",
      severity: "LOW",
      metadata: { email: user.email, role: user.role },
    });

    return NextResponse.json({ user });
  } catch (e) {
    const { status, body } = errorResponse(e);
    return NextResponse.json(body, { status });
  }
}