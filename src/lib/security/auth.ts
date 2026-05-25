import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { SessionPayload, UserRole } from "@/types/property";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/security/session";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/agent/login");
  return session;
}

export async function requireRole(roles: UserRole[]): Promise<SessionPayload> {
  const session = await requireSession();
  if (!roles.includes(session.role)) {
    redirect("/agent/properties");
  }
  return session;
}

