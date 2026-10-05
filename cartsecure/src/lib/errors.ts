import { nanoid } from "nanoid";

export class AppError extends Error {
  status: number;
  code: string;
  incidentId: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.incidentId = `${code.toUpperCase()}-${new Date()
      .toISOString()
      .slice(0, 10)}-${nanoid(6)}`;
  }
}

export const Unauthorized = (m = "Unauthorized") =>
  new AppError(401, "unauthorized", m);

export const Forbidden = (m = "Access denied") =>
  new AppError(403, "forbidden", m);

export const NotFound = (m = "Not found") =>
  new AppError(404, "not_found", m);

export const BadRequest = (m = "Invalid request") =>
  new AppError(400, "bad_request", m);

export const Conflict = (m = "State conflict") =>
  new AppError(409, "conflict", m);

export const TooMany = (m = "Too many requests") =>
  new AppError(429, "rate_limited", m);

export function errorResponse(e: unknown): {
  status: number;
  body: { error: string; incidentId?: string; details?: unknown };
} {
  if (e instanceof AppError) {
    return {
      status: e.status,
      body: { error: e.code, incidentId: e.incidentId, details: e.message },
    };
  }
  if (typeof e === "object" && e !== null && "name" in e && (e as any).name === "ZodError") {
    return {
      status: 400,
      body: { error: "validation", details: (e as any).errors },
    };
  }
  console.error("[unhandled]", e);
  return { status: 500, body: { error: "server_error" } };
}