import argon2 from "argon2";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { randomBytes, createHash } from "crypto";
import { prisma } from "./prisma";

const ACCESS_TTL = "15m";
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const accessSecret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-only-access-secret-change-me"
);

/* ─── Password hashing ─────────────────────────────── */

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(hash, password);
}

/* ─── JWT access tokens ────────────────────────────── */

export type Role = "CUSTOMER" | "SELLER" | "ADMIN";

export type SessionClaims = JWTPayload & {
  sub: string;
  role: Role;
};

export async function signAccessToken(payload: {
  sub: string;
  role: Role;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", kid: "v1" })
    .setIssuedAt()
    .setIssuer("cartsecure")
    .setAudience("cartsecure-web")
    .setExpirationTime(ACCESS_TTL)
    .sign(accessSecret);
}

export async function verifyAccessToken(
  token: string
): Promise<SessionClaims> {
  const { payload } = await jwtVerify(token, accessSecret, {
    issuer: "cartsecure",
    audience: "cartsecure-web",
  });
  return payload as SessionClaims;
}

/* ─── Refresh token rotation ───────────────────────── */

export async function issueRefreshToken(userId: string): Promise<string> {
  const raw = randomBytes(48).toString("base64url");
  const hash = createHash("sha256").update(raw).digest("hex");
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hash,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });
  return raw;
}

export async function rotateRefreshToken(raw: string): Promise<{
  userId: string;
  refresh: string;
} | null> {
  const hash = createHash("sha256").update(raw).digest("hex");
  const row = await prisma.refreshToken.findUnique({
    where: { tokenHash: hash },
  });
  if (!row || row.revokedAt || row.expiresAt < new Date()) return null;

  await prisma.refreshToken.update({
    where: { id: row.id },
    data: { revokedAt: new Date() },
  });

  const next = await issueRefreshToken(row.userId);
  return { userId: row.userId, refresh: next };
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}