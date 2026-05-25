import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validators";
import {
  enforceContactRateLimit,
  enforceGlobalRateLimit,
  jsonError,
  requireCsrf,
} from "@/lib/api";
import { getClientIp } from "@/lib/security/request";
import { createContactMessage, notifyContactMessage } from "@/lib/services/contact-service";

export async function POST(request: Request) {
  const globalLimitError = enforceGlobalRateLimit(request);
  if (globalLimitError) return globalLimitError;

  const contactLimitError = enforceContactRateLimit(request);
  if (contactLimitError) return contactLimitError;

  const csrfError = requireCsrf(request);
  if (csrfError) return csrfError;

  const payload = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError("Data form kontak tidak valid.", 422);
  }

  const ipAddress = getClientIp(request);
  const message = await createContactMessage(parsed.data, ipAddress);
  await notifyContactMessage(message);

  return NextResponse.json({
    ok: true,
    message: "Pesan terkirim, tim kami akan menghubungi Anda.",
  });
}

