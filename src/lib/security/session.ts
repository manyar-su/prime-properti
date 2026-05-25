import { SignJWT, jwtVerify, type JWTPayload } from "jose";

import { env, isProduction } from "@/lib/env";
import type { SessionPayload } from "@/types/property";

export const SESSION_COOKIE = "pp_session";

const encoder = new TextEncoder();
const sessionSecret = encoder.encode(env.SESSION_SECRET);

export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const claims: JWTPayload = {
    email: payload.email,
    role: payload.role,
    name: payload.name,
  };

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(sessionSecret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, sessionSecret);
    return {
      sub: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      role: payload.role as SessionPayload["role"],
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}

