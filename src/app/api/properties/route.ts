import { NextResponse } from "next/server";

import { enforceGlobalRateLimit, jsonError, requireCsrf } from "@/lib/api";
import { propertySchema } from "@/lib/validators";
import { listProperties, createProperty } from "@/lib/services/property-service";
import { parseFilters } from "@/lib/services/property-filters";
import { requireApiRole } from "@/lib/security/auth-api";

export async function GET(request: Request) {
  const globalLimitError = enforceGlobalRateLimit(request);
  if (globalLimitError) return globalLimitError;

  const auth = await requireApiRole(request, ["admin", "superadmin"]);
  if (!auth.session) return jsonError("Unauthorized", 401);

  const url = new URL(request.url);
  const filters = parseFilters(url.searchParams);
  const result = await listProperties(filters);

  return NextResponse.json({
    data: result.data,
    total: result.total,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 50,
  });
}

export async function POST(request: Request) {
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

  const created = await createProperty(parsed.data, auth.session);
  return NextResponse.json({ data: created }, { status: 201 });
}

