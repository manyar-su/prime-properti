import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SESSION_SECRET: z.string().min(32).default("change-me-to-32-char-min-session-secret"),
  CSRF_SECRET: z.string().min(16).default("change-me-csrf-secret"),
  CONTACT_NOTIFY_FUNCTION_URL: z.string().url().optional(),
  CONTACT_NOTIFY_FUNCTION_KEY: z.string().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SESSION_SECRET: process.env.SESSION_SECRET,
  CSRF_SECRET: process.env.CSRF_SECRET,
  CONTACT_NOTIFY_FUNCTION_URL: process.env.CONTACT_NOTIFY_FUNCTION_URL,
  CONTACT_NOTIFY_FUNCTION_KEY: process.env.CONTACT_NOTIFY_FUNCTION_KEY,
});

export const isProduction = env.NODE_ENV === "production";
export const supabasePublishableKey =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

