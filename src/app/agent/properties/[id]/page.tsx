import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AgentShell } from "@/components/agent/agent-shell";
import { DeletePropertyButton } from "@/components/agent/delete-property-button";
import { ReadyBadge, StatusBadge } from "@/components/ui/badge";
import { requireRole } from "@/lib/security/auth";
import { getPropertyById } from "@/lib/services/property-service";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["admin", "superadmin"]);
  const { id } = await params;

  const property = await getPropertyById(id);
  if (!property) notFound();

  return (
    <AgentShell session={session}>
      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{property.nama_property}</h1>
            <p className="text-sm text-zinc-600">Dibuat {formatTanggal(property.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={property.status} />
            <ReadyBadge siap={property.siap} />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <Image
            src={property.foto_url ?? (property.tipe === "ruko" ? "/images/properties/ruko-placeholder.svg" : "/images/properties/villa-placeholder.svg")}
            alt={`Foto ${property.nama_property}`}
            width={1200}
            height={700}
            className="h-72 w-full object-cover"
          />
        </div>

        <div className="grid gap-4 text-sm md:grid-cols-2">
          <p><span className="font-semibold">Group:</span> {property.group ?? "-"}</p>
          <p><span className="font-semibold">Ukuran:</span> {property.lebar} x {property.panjang}</p>
          <p><span className="font-semibold">Hadap:</span> {property.hadap.join(", ")}</p>
          <p><span className="font-semibold">Tipe:</span> {property.tipe.toUpperCase()}</p>
          <p><span className="font-semibold">Tingkat:</span> {property.tingkat}</p>
          <p><span className="font-semibold">Harga:</span> {formatRupiah(property.price)}</p>
          <p><span className="font-semibold">Carport:</span> {property.carport ? "Ya" : "Tidak"}</p>
          <p><span className="font-semibold">Kawasan:</span> {property.kawasan.join(", ")}</p>
          <p><span className="font-semibold">Unit:</span> {property.unit ?? "-"}</p>
          {property.maps_link && (
            <p>
              <a href={property.maps_link} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#C9A961] underline">
                Buka di Google Maps
              </a>
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href="/agent/properties"
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#C9A961] px-4 text-sm font-semibold text-[#C9A961] hover:bg-[#C9A961] hover:text-[#1A1A1A]"
          >
            Kembali
          </Link>
          {session.role === "superadmin" && (
            <>
              <Link
                href={`/agent/properties/${property.id}/edit`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#C9A961] px-4 text-sm font-semibold text-[#1A1A1A] hover:bg-[#b79955]"
              >
                Edit
              </Link>
              <DeletePropertyButton id={property.id} nama={property.nama_property} />
            </>
          )}
        </div>
      </div>
    </AgentShell>
  );
}

