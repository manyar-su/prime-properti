import bcrypt from "bcryptjs";

import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { UserRole } from "@/types/property";

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password_hash: string;
  is_enabled: boolean;
  failed_attempts: number;
  locked_until: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAdminByEmail(email: string): Promise<AdminProfile | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) throw error;
  return data as AdminProfile | null;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function getDemoAdminCredentials() {
  return {
    id: "demo-admin",
    email: env.DEMO_ADMIN_EMAIL.toLowerCase(),
    password: env.DEMO_ADMIN_PASSWORD,
    role: "admin" as UserRole,
    name: "Admin Demo",
  };
}

export async function recordLoginAttempt(params: {
  email: string;
  ipAddress: string;
  success: boolean;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const normalizedEmail = params.email.toLowerCase();

  await supabase.from("login_attempts").insert({
    email: normalizedEmail,
    ip_address: params.ipAddress,
    success: params.success,
  });

  const admin = await getAdminByEmail(normalizedEmail);
  if (!admin) return;

  if (params.success) {
    await supabase
      .from("admin_profiles")
      .update({ failed_attempts: 0, locked_until: null })
      .eq("id", admin.id);
    return;
  }

  const newFailedAttempts = admin.failed_attempts + 1;
  const shouldLock = newFailedAttempts >= 5;
  const lockedUntil = shouldLock ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;

  await supabase
    .from("admin_profiles")
    .update({
      failed_attempts: newFailedAttempts,
      locked_until: lockedUntil,
    })
    .eq("id", admin.id);
}

export function isLocked(admin: AdminProfile): boolean {
  if (!admin.locked_until) return false;
  return new Date(admin.locked_until).getTime() > Date.now();
}

export async function createAdmin(params: {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}) {
  const supabase = getSupabaseAdmin();
  const passwordHash = await bcrypt.hash(params.password, 10);

  const { data, error } = await supabase
    .from("admin_profiles")
    .insert({
      email: params.email.toLowerCase(),
      name: params.name,
      role: params.role,
      password_hash: passwordHash,
    })
    .select("id, email, name, role")
    .single();

  if (error) throw error;
  return data;
}

