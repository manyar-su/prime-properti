import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PropertyType } from "@/types/property";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTanggal(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function parseNumber(input: string | null): number | undefined {
  if (!input) return undefined;
  const normalized = input.replace(/[^0-9.,-]/g, "").replace(/\./g, "").replace(",", ".");
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  return "http://localhost:3000";
}

export function getPropertyImageUrl(property: { foto_url?: string | null; tipe: PropertyType }) {
  if (property.foto_url) return property.foto_url;
  return property.tipe === "ruko"
    ? "/images/properties/ruko-placeholder.svg"
    : "/images/properties/villa-placeholder.svg";
}

