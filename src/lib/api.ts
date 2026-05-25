import { NextResponse } from "next/server";

import { applyRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/request";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function enforceGlobalRateLimit(request: Request) {
  const ip = getClientIp(request);
  const result = applyRateLimit(`global:${ip}`, RATE_LIMITS.global);
  if (!result.allowed) {
    return jsonError("Terlalu banyak permintaan. Coba lagi nanti.", 429);
  }
  return null;
}

export function enforceAuthRateLimit(request: Request) {
  const ip = getClientIp(request);
  const result = applyRateLimit(`auth:${ip}`, RATE_LIMITS.auth);
  if (!result.allowed) {
    return jsonError("Batas login tercapai. Coba lagi nanti.", 429);
  }
  return null;
}

export function enforceContactRateLimit(request: Request) {
  const ip = getClientIp(request);
  const result = applyRateLimit(`contact:${ip}`, RATE_LIMITS.contact);
  if (!result.allowed) {
    return jsonError("Maksimal 3 submit per jam per IP.", 429);
  }
  return null;
}

export function requireCsrf(request: Request) {
  const tokenHeader = request.headers.get("x-csrf-token");
  const tokenCookie = request.headers.get("cookie")?.match(/pp_csrf=([^;]+)/)?.[1];
  if (!tokenHeader || !tokenCookie || tokenHeader !== decodeURIComponent(tokenCookie)) {
    return jsonError("CSRF token tidak valid.", 403);
  }
  return null;
}

