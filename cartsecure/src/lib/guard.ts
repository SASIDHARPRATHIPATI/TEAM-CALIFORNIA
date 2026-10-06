import { headers } from "next/headers";
import { Forbidden, Unauthorized } from "./errors";

export type Role = "CUSTOMER" | "SELLER" | "ADMIN";

export async function currentUserId(): Promise<string> {
  const h = await headers();
  const id = h.get("x-user-id");
  if (!id) throw Unauthorized("No session");
  return id;
}

export async function currentUserIdOrNull(): Promise<string | null> {
  const h = await headers();
  return h.get("x-user-id") ?? null;
}

export async function currentRole(): Promise<Role> {
  const h = await headers();
  const r = h.get("x-user-role");
  if (r === "ADMIN" || r === "SELLER" || r === "CUSTOMER") return r;
  return "CUSTOMER";
}

export async function requireRole(...roles: Role[]): Promise<void> {
  const role = await currentRole();
  if (!roles.includes(role)) {
    throw Forbidden("Insufficient role");
  }
}

export function assertOwnership(
  recordUserId: string | null | undefined,
  actorUserId: string
): void {
  if (!recordUserId || recordUserId !== actorUserId) {
    throw Forbidden("Ownership mismatch");
  }
}