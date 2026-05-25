import type { Property, PropertyFilters } from "@/types/property";

const KAWASAN = ["Krakatau", "Pancing", "Tembung", "Helvetia", "Cemara Asri", "Kuala"];
const HADAP = ["Utara", "Selatan", "Timur", "Barat"] as const;
const RUKO_PINTEREST_PHOTOS = [
  "https://i.pinimg.com/736x/9b/36/b1/9b36b15cf1f7b6cf8bbe09b275eef729.jpg",
  "https://i.pinimg.com/originals/b7/e9/8e/b7e98eb13b857ff9c84a31d221dac701.jpg",
];
const VILLA_PINTEREST_PHOTOS = [
  "https://i.pinimg.com/564x/07/d5/fd/07d5fdc822cf85ef3c995455ad3253a5.jpg",
  "https://i.pinimg.com/originals/b7/e9/8e/b7e98eb13b857ff9c84a31d221dac701.jpg",
];

function generateDummyProperty(index: number): Property {
  const nomor = index + 1;
  const now = new Date(2026, 4, 1 + index).toISOString();
  const kawasan = KAWASAN[index % KAWASAN.length];
  const hadap = HADAP[index % HADAP.length];
  const status = nomor % 7 === 0 ? "sold_out" : "in_stock";
  const tipe = nomor % 2 === 0 ? "ruko" : "villa";
  const fotoRuko = RUKO_PINTEREST_PHOTOS[index % RUKO_PINTEREST_PHOTOS.length];
  const fotoVilla = VILLA_PINTEREST_PHOTOS[index % VILLA_PINTEREST_PHOTOS.length];

  return {
    id: `dummy-${nomor}`,
    nama_property: `Placeholder Prime ${String(nomor).padStart(2, "0")}`,
    foto_url: tipe === "ruko" ? fotoRuko : fotoVilla,
    group: nomor % 4 === 0 ? null : `Cluster ${((nomor - 1) % 6) + 1}`,
    lebar: 4 + ((nomor - 1) % 4) + 0.5,
    panjang: 12 + ((nomor - 1) % 10),
    hadap: [hadap],
    tipe,
    tingkat: nomor % 5 === 0 ? 2.5 : ((nomor - 1) % 3) + 1,
    price: 550_000_000 + nomor * 22_500_000,
    carport: nomor % 3 !== 0,
    status,
    siap:
      nomor % 5 === 0 ? "siap_huni_renovasi" : nomor % 2 === 0 ? "siap_huni" : "siap_kosong",
    maps_link: "https://www.google.com/maps",
    kawasan: [kawasan],
    unit: nomor % 3 === 0 ? "Ready Siap Huni" : "Gate Siap",
    created_at: now,
    updated_at: now,
    deleted_at: null,
    created_by: "dummy-superadmin",
  };
}

export const DUMMY_PROPERTIES: Property[] = Array.from({ length: 60 }, (_, i) => generateDummyProperty(i));

export function filterDummyProperties(filters: PropertyFilters): { data: Property[]; total: number } {
  let rows = DUMMY_PROPERTIES.filter((row) => row.deleted_at === null);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.nama_property.toLowerCase().includes(q) ||
        (row.group ?? "").toLowerCase().includes(q) ||
        row.kawasan.join(",").toLowerCase().includes(q),
    );
  }

  if (filters.kawasan?.length) {
    rows = rows.filter((row) => filters.kawasan?.some((k) => row.kawasan.includes(k)));
  }

  if (filters.hadap?.length) {
    rows = rows.filter((row) => filters.hadap?.some((h) => row.hadap.includes(h)));
  }

  if (filters.tipe && filters.tipe !== "all") {
    rows = rows.filter((row) => row.tipe === filters.tipe);
  }

  if (filters.status && filters.status !== "all") {
    rows = rows.filter((row) => row.status === filters.status);
  }

  if (filters.siap?.length) {
    rows = rows.filter((row) => filters.siap?.includes(row.siap));
  }

  if (filters.carport && filters.carport !== "all") {
    rows = rows.filter((row) => row.carport === (filters.carport === "yes"));
  }

  if (typeof filters.lebarMin === "number") {
    rows = rows.filter((row) => row.lebar >= filters.lebarMin!);
  }

  if (typeof filters.hargaMax === "number") {
    rows = rows.filter((row) => row.price <= filters.hargaMax!);
  }

  const sortBy = filters.sortBy ?? "created_at";
  const sortOrder = filters.sortOrder ?? "desc";
  rows = rows.sort((a, b) => {
    const left = a[sortBy];
    const right = b[sortBy];

    if (typeof left === "number" && typeof right === "number") {
      return sortOrder === "asc" ? left - right : right - left;
    }
    const l = String(left);
    const r = String(right);
    return sortOrder === "asc" ? l.localeCompare(r) : r.localeCompare(l);
  });

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 50;
  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  return {
    data: rows.slice(from, to),
    total: rows.length,
  };
}
