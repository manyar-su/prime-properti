import { createHash, timingSafeEqual } from "node:crypto";

import { env } from "@/lib/env";

export const CSRF_COOKIE = "pp_csrf";

function sign(value: string): string {
  const hash = createHash("sha256");
  hash.update(`${value}.${env.CSRF_SECRET}`);
  return hash.digest("hex");
}

export function createCsrfToken(): string {
  const value = crypto.randomUUID();
  return `${value}.${sign(value)}`;
}

export function verifyCsrfToken(token?: string | null): boolean {
  if (!token) return false;
  const [value, signature] = token.split(".");
  if (!value || !signature) return false;
  const expected = sign(value);
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

