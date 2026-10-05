import { headers } from "next/headers";
import { prisma } from "./prisma";

type Severity = "LOW" | "MEDIUM" | "HIGH";

export async function writeAudit(opts: {
  userId?: string | null;
  action: string;
  severity?: Severity;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const h = headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null;
    const userAgent = h.get("user-agent") ?? null;

    await prisma.auditEvent.create({
      data: {
        userId: opts.userId ?? null,
        action: opts.action,
        severity: opts.severity ?? "LOW",
        ip,
        userAgent,
        metadata: (opts.metadata ?? {}) as object,
      },
    });
  } catch (e) {
    // Never let audit failures break the request
    console.error("[audit] failed to write:", e);
  }
}