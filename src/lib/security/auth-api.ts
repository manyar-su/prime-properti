import type { SessionPayload, UserRole } from "@/types/property";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/security/session";

function getCookieValue(cookieHeader: string | null, key: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${key}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function getSessionFromRequest(request: Request): Promise<SessionPayload | null> {
  const rawCookie = request.headers.get("cookie");
  const token = getCookieValue(rawCookie, SESSION_COOKIE);
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireApiSession(request: Request): Promise<SessionPayload | null> {
  return getSessionFromRequest(request);
}

export async function requireApiRole(
  request: Request,
  roles: UserRole[],
): Promise<{ session: SessionPayload | null; forbidden: boolean }> {
  const session = await getSessionFromRequest(request);
  if (!session) return { session: null, forbidden: true };
  return { session, forbidden: !roles.includes(session.role) };
}

