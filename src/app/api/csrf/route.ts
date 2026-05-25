import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createCsrfToken, CSRF_COOKIE } from "@/lib/security/csrf";

export async function GET() {
  const token = createCsrfToken();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });

  return NextResponse.json({ token });
}

