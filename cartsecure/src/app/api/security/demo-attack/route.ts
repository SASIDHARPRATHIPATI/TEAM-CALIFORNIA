import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeAudit } from "@/lib/audit";

const Schema = z.object({
  attack: z.enum(["sqli", "idor", "prompt_injection", "rate_limit"]),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const { attack } = Schema.parse(await req.json());

    const simulations = {
      sqli: {
        action: "attack.sqli.blocked",
        severity: "HIGH" as const,
        detail: "Zod strict schema rejected payload: ' OR 1=1--",
      },
      idor: {
        action: "attack.idor.blocked",
        severity: "HIGH" as const,
        detail: "Ownership predicate rejected cross-user access on order:ord_demo",
      },
      prompt_injection: {
        action: "attack.prompt_injection.blocked",
        severity: "HIGH" as const,
        detail: "System prompt isolation blocked: 'Ignore all previous instructions'",
      },
      rate_limit: {
        action: "attack.rate_limit.blocked",
        severity: "MEDIUM" as const,
        detail: "Upstash sliding window rejected request #6 from same IP",
      },
    };

    const sim = simulations[attack];

    await writeAudit({
      action: sim.action,
      severity: sim.severity,
      metadata: { demo: true, detail: sim.detail },
    });

    return NextResponse.json({
      blocked: true,
      attack,
      action: sim.action,
      severity: sim.severity,
      detail: sim.detail,
      incidentId: `INC-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}