import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { clearAuthCookies } from "@/lib/session";
import { revokeAllUserTokens } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";

export async function POST() {
  const h = await headers();
  const userId = h.get("x-user-id");

  if (userId) {
    await revokeAllUserTokens(userId);
    await writeAudit({ userId, action: "auth.logout", severity: "LOW" });
  }

  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}