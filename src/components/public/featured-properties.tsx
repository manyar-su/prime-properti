"use client";

import Image from "next/image";
import { useState } from "react";

import { PropertyDetailModal } from "@/components/properties/property-detail-modal";
import { ReadyBadge, StatusBadge } from "@/components/ui/badge";
import { formatRupiah, getPropertyImageUrl } from "@/lib/utils";
import type { Property } from "@/types/property";

export function FeaturedProperties({ properties }: { properties: Property[] }) {
  const [active, setActive] = useState<Property | null>(null);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <article
            key={property.id}
            role="button"
            tabIndex={0}
            onClick={() => setActive(property)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActive(property);
              }
            }}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative">
              <Image
                src={getPropertyImageUrl(property)}
                alt={`Foto ${property.nama_property}`}
                width={800}
                height={500}
                className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status={property.status} />
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">{property.nama_property}</h3>
                <p className="text-sm text-zinc-600">{property.group ?? "Tanpa group"}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
                <p>Ukuran: {property.lebar} x {property.panjang}</p>
                <p>Tingkat: {property.tingkat}</p>
                <p>Tipe: {property.tipe.toUpperCase()}</p>
                <p>Carport: {property.carport ? "Ya" : "Tidak"}</p>
              </div>

              <div className="flex items-center justify-between">
                <ReadyBadge siap={property.siap} />
                <p className="text-base font-extrabold text-[#1A1A1A]">{formatRupiah(property.price)}</p>
              </div>

              <p className="text-xs font-medium text-[#C9A961]">Klik untuk lihat detail lengkap</p>
            </div>
          </article>
        ))}
      </div>

      <PropertyDetailModal property={active} onClose={() => setActive(null)} mode="public" />
    </>
  );
}
