import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/security/session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return NextResponse.json({ ok: true });
}

