import type { PropertyFilters } from "@/types/property";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { parseNumber } from "@/lib/utils";

export function parseFilters(searchParams: URLSearchParams): PropertyFilters {
  const kawasan = searchParams.get("kawasan")?.split(",").filter(Boolean);
  const hadap = searchParams.get("hadap")?.split(",").filter(Boolean);
  const siap = searchParams.get("siap")?.split(",").filter(Boolean) as PropertyFilters["siap"];

  return {
    search: searchParams.get("search") ?? undefined,
    kawasan: kawasan?.length ? kawasan : undefined,
    hadap: hadap?.length ? hadap : undefined,
    tipe: (searchParams.get("tipe") as PropertyFilters["tipe"]) ?? "all",
    status: (searchParams.get("status") as PropertyFilters["status"]) ?? "all",
    siap: siap?.length ? siap : undefined,
    carport: (searchParams.get("carport") as PropertyFilters["carport"]) ?? "all",
    lebarMin: parseNumber(searchParams.get("lebarMin")),
    hargaMax: parseNumber(searchParams.get("hargaMax")),
    sortBy: (searchParams.get("sortBy") as PropertyFilters["sortBy"]) ?? "created_at",
    sortOrder: (searchParams.get("sortOrder") as PropertyFilters["sortOrder"]) ?? "desc",
    page: Number(searchParams.get("page") ?? "1"),
    pageSize: Number(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE)),
  };
}

