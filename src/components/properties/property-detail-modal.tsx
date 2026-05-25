"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { ReadyBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TYPE_LABELS } from "@/lib/constants";
import { formatRupiah, formatTanggal, getPropertyImageUrl } from "@/lib/utils";
import type { Property } from "@/types/property";

export function PropertyDetailModal({
  property,
  onClose,
  mode = "public",
}: {
  property: Property | null;
  onClose: () => void;
  mode?: "public" | "agent";
}) {
  useEffect(() => {
    if (!property) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [property, onClose]);

  if (!property) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup detail"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="relative">
          <Image
            src={getPropertyImageUrl(property)}
            alt={`Foto ${property.nama_property}`}
            width={1200}
            height={700}
            className="h-64 w-full object-cover sm:h-80"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <StatusBadge status={property.status} />
            <ReadyBadge siap={property.siap} />
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Detail Properti</p>
              <h3 className="text-2xl font-bold text-[#1A1A1A]">{property.nama_property}</h3>
              <p className="mt-1 text-sm text-zinc-600">{property.group ?? "Tanpa group"}</p>
            </div>
            <p className="rounded-lg bg-[#1A1A1A] px-4 py-2 text-lg font-bold text-[#C9A961]">{formatRupiah(property.price)}</p>
          </div>

          <div className="grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <p><span className="font-semibold">Tipe:</span> {TYPE_LABELS[property.tipe]}</p>
            <p><span className="font-semibold">Ukuran:</span> {property.lebar} x {property.panjang} m</p>
            <p><span className="font-semibold">Tingkat:</span> {property.tingkat}</p>
            <p><span className="font-semibold">Hadap:</span> {property.hadap.join(", ")}</p>
            <p><span className="font-semibold">Carport:</span> {property.carport ? "Ya" : "Tidak"}</p>
            <p><span className="font-semibold">Kawasan:</span> {property.kawasan.join(", ")}</p>
            <p><span className="font-semibold">Unit:</span> {property.unit ?? "-"}</p>
            <p><span className="font-semibold">Dibuat:</span> {formatTanggal(property.created_at)}</p>
            <p><span className="font-semibold">Diupdate:</span> {formatTanggal(property.updated_at)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {property.maps_link && (
              <a
                href={property.maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#C9A961] px-4 text-sm font-semibold text-[#C9A961] hover:bg-[#C9A961] hover:text-[#1A1A1A]"
              >
                Buka Google Maps
              </a>
            )}

            {mode === "agent" && (
              <Link
                href={`/agent/properties/${property.id}`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#1A1A1A] px-4 text-sm font-semibold text-white hover:bg-[#111]"
              >
                Halaman Detail
              </Link>
            )}

            <Button variant="ghost" onClick={onClose}>Tutup</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
