"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { PropertyDetailModal } from "@/components/properties/property-detail-modal";
import type { Property } from "@/types/property";
import { DEFAULT_KAWASAN_OPTIONS, DEFAULT_PAGE_SIZE, PAGINATION_OPTIONS, TYPE_LABELS } from "@/lib/constants";
import { formatRupiah, getPropertyImageUrl } from "@/lib/utils";
import { ReadyBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function useDebouncedValue(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function buildQuery(
  current: URLSearchParams,
  updates: Record<string, string | number | null | undefined>,
) {
  const params = new URLSearchParams(current.toString());
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });
  params.set("page", "1");
  return params;
}

export function PropertyListClient({
  properties,
  total,
  page,
  pageSize,
  role,
}: {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
  role: "admin" | "superadmin";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    const params = buildQuery(new URLSearchParams(searchParams.toString()), {
      search: debouncedSearch || null,
    });
    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; value: string }> = [];
    searchParams.forEach((value, key) => {
      if (key === "page" || key === "pageSize" || key === "sortBy" || key === "sortOrder") return;
      chips.push({ key, label: key, value });
    });
    return chips;
  }, [searchParams]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama/group/kawasan..." />
          <select
            className="h-10 rounded-md border border-zinc-300 px-3 text-sm"
            defaultValue={searchParams.get("status") ?? "all"}
            onChange={(e) => {
              const params = buildQuery(new URLSearchParams(searchParams.toString()), {
                status: e.target.value,
              });
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            <option value="all">Status: Semua</option>
            <option value="in_stock">In Stock</option>
            <option value="sold_out">Sold Out</option>
          </select>
          <select
            className="h-10 rounded-md border border-zinc-300 px-3 text-sm"
            defaultValue={searchParams.get("tipe") ?? "all"}
            onChange={(e) => {
              const params = buildQuery(new URLSearchParams(searchParams.toString()), {
                tipe: e.target.value,
              });
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            <option value="all">Tipe: Semua</option>
            <option value="ruko">Ruko</option>
            <option value="villa">Villa</option>
          </select>
          <select
            className="h-10 rounded-md border border-zinc-300 px-3 text-sm"
            defaultValue={searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE)}
            onChange={(e) => {
              const params = buildQuery(new URLSearchParams(searchParams.toString()), {
                pageSize: Number(e.target.value),
              });
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            {PAGINATION_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} baris
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <select
            className="h-10 rounded-md border border-zinc-300 px-3 text-sm"
            defaultValue={searchParams.get("kawasan") ?? ""}
            onChange={(e) => {
              const params = buildQuery(new URLSearchParams(searchParams.toString()), {
                kawasan: e.target.value || null,
              });
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            <option value="">Kawasan: Semua</option>
            {DEFAULT_KAWASAN_OPTIONS.map((kawasan) => (
              <option key={kawasan} value={kawasan}>
                {kawasan}
              </option>
            ))}
          </select>
          <Input
            defaultValue={searchParams.get("lebarMin") ?? ""}
            placeholder="Lebar min (m)"
            onBlur={(e) => {
              const params = buildQuery(new URLSearchParams(searchParams.toString()), {
                lebarMin: e.target.value || null,
              });
              router.push(`${pathname}?${params.toString()}`);
            }}
          />
          <Input
            defaultValue={searchParams.get("hargaMax") ?? ""}
            placeholder="Harga maksimal"
            onBlur={(e) => {
              const params = buildQuery(new URLSearchParams(searchParams.toString()), {
                hargaMax: e.target.value || null,
              });
              router.push(`${pathname}?${params.toString()}`);
            }}
          />
        </div>

        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={`${chip.key}-${chip.value}`}
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete(chip.key);
                  router.push(`${pathname}?${params.toString()}`);
                }}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs"
              >
                {chip.label}: {chip.value} x
              </button>
            ))}
            <Button
              variant="ghost"
              onClick={() => {
                router.push(pathname);
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}
      </section>

      <section className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-gradient-to-r from-zinc-100 to-[#f5edd8] text-xs uppercase text-zinc-600">
            <tr>
              <th className="px-3 py-2">Foto</th>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">Group</th>
              <th className="px-3 py-2">Ukuran</th>
              <th className="px-3 py-2">Hadap</th>
              <th className="px-3 py-2">Tipe</th>
              <th className="px-3 py-2">Tingkat</th>
              <th className="px-3 py-2">Harga</th>
              <th className="px-3 py-2">Carport</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Siap</th>
              <th className="px-3 py-2">Kawasan</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-zinc-100 transition hover:bg-amber-50/40">
                <td className="px-3 py-2">
                  <Image
                    src={getPropertyImageUrl(property)}
                    alt={`Foto ${property.nama_property}`}
                    width={160}
                    height={120}
                    className="h-12 w-16 rounded object-cover"
                  />
                </td>
                <td className="px-3 py-2 font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveProperty(property)}
                    className="cursor-pointer text-left text-[#1A1A1A] hover:text-[#C9A961] hover:underline"
                  >
                    {property.nama_property}
                  </button>
                </td>
                <td className="px-3 py-2">{property.group ?? "-"}</td>
                <td className="px-3 py-2">{property.lebar} x {property.panjang}</td>
                <td className="px-3 py-2">{property.hadap.join(", ")}</td>
                <td className="px-3 py-2">{TYPE_LABELS[property.tipe]}</td>
                <td className="px-3 py-2">{property.tingkat}</td>
                <td className="px-3 py-2">{formatRupiah(property.price)}</td>
                <td className="px-3 py-2">{property.carport ? "Ya" : "Tidak"}</td>
                <td className="px-3 py-2"><StatusBadge status={property.status} /></td>
                <td className="px-3 py-2"><ReadyBadge siap={property.siap} /></td>
                <td className="px-3 py-2">{property.kawasan.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {properties.length === 0 && <p className="px-4 py-8 text-sm text-zinc-500">Tidak ada data properti.</p>}
      </section>

      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600">Total {total} properti</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(page - 1));
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            Sebelumnya
          </Button>
          <span className="text-sm">Hal. {page} / {pages}</span>
          <Button
            variant="outline"
            disabled={page >= pages}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(page + 1));
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            Berikutnya
          </Button>
        </div>
      </div>

      {role === "superadmin" && (
        <div>
          <Link href="/agent/properties/new" className="inline-block rounded-md bg-[#C9A961] px-4 py-2 text-sm font-semibold text-[#1A1A1A]">
            + Tambah Properti
          </Link>
        </div>
      )}

      <PropertyDetailModal property={activeProperty} onClose={() => setActiveProperty(null)} mode="agent" />
    </div>
  );
}

