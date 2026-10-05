import { headers } from "next/headers";
import { Forbidden, Unauthorized } from "./errors";

export type Role = "CUSTOMER" | "SELLER" | "ADMIN";

/**
 * Read the current user id — set by middleware after JWT verification.
 * Throws Unauthorized if missing.
 */
export function currentUserId(): string {
  const id = headers().get("x-user-id");
  if (!id) throw Unauthorized("No session");
  return id;
}

export function currentUserIdOrNull(): string | null {
  return headers().get("x-user-id") ?? null;
}

export function currentRole(): Role {
  const r = headers().get("x-user-role");
  if (r === "ADMIN" || r === "SELLER" || r === "CUSTOMER") return r;
  return "CUSTOMER";
}

export function requireRole(...roles: Role[]): void {
  if (!roles.includes(currentRole())) {
    throw Forbidden("Insufficient role");
  }
}

/**
 * Enforce ownership — throws Forbidden if the record's userId
 * doesn't match the current session user.
 */
export function assertOwnership(
  recordUserId: string | null | undefined,
  actorUserId: string
): void {
  if (!recordUserId || recordUserId !== actorUserId) {
    throw Forbidden("Ownership mismatch");
  }
}