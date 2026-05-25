import { AgentShell } from "@/components/agent/agent-shell";
import { PropertyListClient } from "@/components/agent/property-list-client";
import { requireRole } from "@/lib/security/auth";
import { parseFilters } from "@/lib/services/property-filters";
import { listProperties } from "@/lib/services/property-service";

export default async function AgentPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireRole(["admin", "superadmin"]);

  const resolvedParams = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (Array.isArray(value)) {
      urlParams.set(key, value.join(","));
    } else if (typeof value === "string") {
      urlParams.set(key, value);
    }
  }

  const filters = parseFilters(urlParams);
  const { data, total } = await listProperties(filters);

  return (
    <AgentShell session={session}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Listing Properti</h1>
          <p className="text-sm text-zinc-600">Cari, filter, dan lihat detail listing properti internal.</p>
          <p className="text-xs text-zinc-500">
            Mode placeholder: data dummy tampil otomatis saat data tabel properti belum tersedia.
          </p>
        </div>
        <PropertyListClient
          properties={data}
          total={total}
          page={filters.page ?? 1}
          pageSize={filters.pageSize ?? 50}
          role={session.role}
        />
      </div>
    </AgentShell>
  );
}

