import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/security/session";
import { enforceAuthRateLimit, enforceGlobalRateLimit, jsonError } from "@/lib/api";
import { loginSchema } from "@/lib/validators";
import {
  getDemoAdminCredentials,
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
  const inputEmail = parsed.data.email.toLowerCase();
  const demo = getDemoAdminCredentials();

  async function safeRecord(success: boolean) {
    try {
      await recordLoginAttempt({ email: inputEmail, ipAddress, success });
    } catch {
      // ignore when login_attempts table is not reachable
    }
  }

  // Demo fallback account for quick access when Supabase admin table isn't ready.
  if (inputEmail === demo.email && parsed.data.password === demo.password) {
    const token = await createSessionToken({
      sub: demo.id,
      email: demo.email,
      role: demo.role,
      name: demo.name,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions);

    return NextResponse.json({
      ok: true,
      user: {
        id: demo.id,
        email: demo.email,
        role: demo.role,
        name: demo.name,
      },
    });
  }

  let admin = null;
  try {
    admin = await getAdminByEmail(inputEmail);
  } catch {
    await safeRecord(false);
    return jsonError("Email atau password salah.", 401);
  }

  if (!admin || !admin.is_enabled) {
    await safeRecord(false);
    return jsonError("Email atau password salah.", 401);
  }

  if (isLocked(admin)) {
    return jsonError("Akun terkunci sementara. Coba lagi 15 menit.", 423);
  }

  const ok = await verifyPassword(parsed.data.password, admin.password_hash);
  if (!ok) {
    await safeRecord(false);
    return jsonError("Email atau password salah.", 401);
  }

  await safeRecord(true);

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

