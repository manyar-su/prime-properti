import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/security/session";
import { enforceAuthRateLimit, enforceGlobalRateLimit, jsonError } from "@/lib/api";
import { loginSchema } from "@/lib/validators";
import {
  getAdminByEmail,
  isLocked,
  recordLoginAttempt,
  verifyPassword,
} from "@/lib/services/auth-service";
import { getClientIp } from "@/lib/security/request";

export async function POST(request: Request) {
  const globalLimitError = enforceGlobalRateLimit(request);
  if (globalLimitError) return globalLimitError;

  const authLimitError = enforceAuthRateLimit(request);
  if (authLimitError) return authLimitError;

  const payload = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) return jsonError("Payload login tidak valid.", 422);

  const ipAddress = getClientIp(request);
  const admin = await getAdminByEmail(parsed.data.email);

  if (!admin || !admin.is_enabled) {
    await recordLoginAttempt({ email: parsed.data.email, ipAddress, success: false });
    return jsonError("Email atau password salah.", 401);
  }

  if (isLocked(admin)) {
    return jsonError("Akun terkunci sementara. Coba lagi 15 menit.", 423);
  }

  const ok = await verifyPassword(parsed.data.password, admin.password_hash);
  if (!ok) {
    await recordLoginAttempt({ email: parsed.data.email, ipAddress, success: false });
    return jsonError("Email atau password salah.", 401);
  }

  await recordLoginAttempt({ email: parsed.data.email, ipAddress, success: true });

  const token = await createSessionToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions);

  return NextResponse.json({
    ok: true,
    user: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    },
  });
}

