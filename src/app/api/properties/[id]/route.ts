import { NextResponse } from "next/server";

import { enforceGlobalRateLimit, jsonError, requireCsrf } from "@/lib/api";
import { propertySchema } from "@/lib/validators";
import {
  getPropertyById,
  softDeleteProperty,
  updateProperty,
} from "@/lib/services/property-service";
import { requireApiRole } from "@/lib/security/auth-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const globalLimitError = enforceGlobalRateLimit(request);
  if (globalLimitError) return globalLimitError;

  const auth = await requireApiRole(request, ["admin", "superadmin"]);
  if (!auth.session) return jsonError("Unauthorized", 401);

  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) return jsonError("Properti tidak ditemukan.", 404);
  return NextResponse.json({ data: property });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const globalLimitError = enforceGlobalRateLimit(request);
  if (globalLimitError) return globalLimitError;

  const csrfError = requireCsrf(request);
  if (csrfError) return csrfError;

  const auth = await requireApiRole(request, ["superadmin"]);
  if (!auth.session) return jsonError("Unauthorized", 401);
  if (auth.forbidden) return jsonError("Forbidden", 403);

  const payload = await request.json().catch(() => null);
  const parsed = propertySchema.safeParse(payload);
  if (!parsed.success) return jsonError("Payload properti tidak valid.", 422);

  const { id } = await params;
  const updated = await updateProperty(id, parsed.data, auth.session);
  return NextResponse.json({ data: updated });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const globalLimitError = enforceGlobalRateLimit(request);
  if (globalLimitError) return globalLimitError;

  const csrfError = requireCsrf(request);
  if (csrfError) return csrfError;

  const auth = await requireApiRole(request, ["superadmin"]);
  if (!auth.session) return jsonError("Unauthorized", 401);
  if (auth.forbidden) return jsonError("Forbidden", 403);

  const { id } = await params;
  await softDeleteProperty(id, auth.session);
  return NextResponse.json({ ok: true });
}

