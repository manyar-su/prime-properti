import { cn } from "@/lib/utils";
import { SIAP_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { PropertyReadyStatus, PropertyStatus } from "@/types/property";

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "in_stock" && "bg-emerald-100 text-emerald-800",
        status === "sold_out" && "bg-[#B33A3A] text-white",
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function ReadyBadge({ siap }: { siap: PropertyReadyStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold",
        siap === "siap_huni" && "bg-amber-100 text-amber-800",
        siap === "siap_kosong" && "bg-violet-100 text-violet-800",
        siap === "siap_huni_renovasi" && "bg-sky-100 text-sky-800",
      )}
    >
      {SIAP_LABELS[siap]}
    </span>
  );
}

