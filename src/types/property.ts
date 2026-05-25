export type UserRole = "admin" | "superadmin";

export type PropertyType = "ruko" | "villa";

export type PropertyStatus = "in_stock" | "sold_out";

export type PropertyReadyStatus = "siap_huni" | "siap_kosong" | "siap_huni_renovasi";

export interface Property {
  id: string;
  nama_property: string;
  group: string | null;
  lebar: number;
  panjang: number;
  hadap: string[];
  tipe: PropertyType;
  tingkat: number;
  price: number;
  carport: boolean;
  status: PropertyStatus;
  siap: PropertyReadyStatus;
  maps_link: string | null;
  kawasan: string[];
  unit: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
}

export interface PropertyFilters {
  search?: string;
  kawasan?: string[];
  hadap?: string[];
  tipe?: PropertyType | "all";
  status?: PropertyStatus | "all";
  siap?: PropertyReadyStatus[];
  carport?: "all" | "yes" | "no";
  lebarMin?: number;
  hargaMax?: number;
  sortBy?: "nama_property" | "price" | "created_at" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface SessionPayload {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface ContactMessagePayload {
  nama: string;
  email: string;
  nomorHp: string;
  pesan: string;
}

