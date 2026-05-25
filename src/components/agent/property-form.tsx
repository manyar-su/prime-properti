"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { getCsrfToken } from "@/lib/client/csrf";
import type { Property } from "@/types/property";

type Props = {
  mode: "create" | "edit";
  initialValue?: Property;
};

function valueOrEmpty(value?: string | null) {
  return value ?? "";
}

export function PropertyForm({ mode, initialValue }: Props) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const defaults = useMemo(
    () => ({
      nama_property: valueOrEmpty(initialValue?.nama_property),
      group: valueOrEmpty(initialValue?.group),
      lebar: String(initialValue?.lebar ?? ""),
      panjang: String(initialValue?.panjang ?? ""),
      hadap: initialValue?.hadap.join(",") ?? "Utara",
      tipe: initialValue?.tipe ?? "ruko",
      tingkat: String(initialValue?.tingkat ?? "1"),
      price: String(initialValue?.price ?? ""),
      carport: initialValue?.carport ? "yes" : "no",
      status: initialValue?.status ?? "in_stock",
      siap: initialValue?.siap ?? "siap_huni",
      maps_link: valueOrEmpty(initialValue?.maps_link),
      kawasan: initialValue?.kawasan.join(",") ?? "Krakatau",
      unit: valueOrEmpty(initialValue?.unit),
    }),
    [initialValue],
  );

  async function onSubmit(formData: FormData) {
    setIsSaving(true);
    setErrors({});

    const payload = {
      nama_property: String(formData.get("nama_property") || "").trim(),
      group: String(formData.get("group") || "").trim() || null,
      lebar: Number(formData.get("lebar") || 0),
      panjang: Number(formData.get("panjang") || 0),
      hadap: String(formData.get("hadap") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      tipe: String(formData.get("tipe") || "ruko"),
      tingkat: Number(formData.get("tingkat") || 1),
      price: Number(String(formData.get("price") || "0").replace(/\./g, "")),
      carport: String(formData.get("carport") || "no") === "yes",
      status: String(formData.get("status") || "in_stock"),
      siap: String(formData.get("siap") || "siap_huni"),
      maps_link: String(formData.get("maps_link") || "").trim() || null,
      kawasan: String(formData.get("kawasan") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      unit: String(formData.get("unit") || "").trim() || null,
    };

    if (payload.nama_property.length < 3) {
      setErrors((prev) => ({ ...prev, nama_property: "Nama properti minimal 3 karakter." }));
      setIsSaving(false);
      return;
    }
    if (payload.lebar <= 0 || payload.panjang <= 0) {
      setErrors((prev) => ({ ...prev, ukuran: "Lebar dan panjang harus lebih dari 0." }));
      setIsSaving(false);
      return;
    }
    if (payload.price <= 0 || !Number.isInteger(payload.price)) {
      setErrors((prev) => ({ ...prev, price: "Harga harus integer rupiah > 0." }));
      setIsSaving(false);
      return;
    }

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(
        mode === "create" ? "/api/properties" : `/api/properties/${initialValue?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        pushToast(body.error ?? "Gagal menyimpan properti.", "error");
        setIsSaving(false);
        return;
      }

      pushToast(mode === "create" ? "Properti berhasil ditambahkan." : "Properti berhasil diperbarui.");
      router.push("/agent/properties");
      router.refresh();
    } catch {
      pushToast("Terjadi kesalahan jaringan.", "error");
      setIsSaving(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nama Properti</label>
          <Input name="nama_property" defaultValue={defaults.nama_property} required />
          {errors.nama_property && <p className="text-xs text-[#B33A3A]">{errors.nama_property}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Group</label>
          <Input name="group" defaultValue={defaults.group} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Lebar (m)</label>
          <Input name="lebar" type="number" step="0.01" defaultValue={defaults.lebar} required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Panjang (m)</label>
          <Input name="panjang" type="number" step="0.01" defaultValue={defaults.panjang} required />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Hadap (pisahkan koma)</label>
          <Input name="hadap" defaultValue={defaults.hadap} required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Tipe</label>
          <select name="tipe" defaultValue={defaults.tipe} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
            <option value="ruko">Ruko</option>
            <option value="villa">Villa</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Tingkat</label>
          <Input name="tingkat" type="number" step="0.1" min={1} max={10} defaultValue={defaults.tingkat} required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Harga (Rupiah)</label>
          <Input name="price" defaultValue={defaults.price} required />
          {errors.price && <p className="text-xs text-[#B33A3A]">{errors.price}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Carport</label>
          <select name="carport" defaultValue={defaults.carport} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
            <option value="yes">Ya</option>
            <option value="no">Tidak</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Status</label>
          <select name="status" defaultValue={defaults.status} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
            <option value="in_stock">In Stock</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Siap</label>
          <select name="siap" defaultValue={defaults.siap} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
            <option value="siap_huni">Siap Huni</option>
            <option value="siap_kosong">Siap Kosong</option>
            <option value="siap_huni_renovasi">Siap Huni Renovasi</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Maps Link</label>
          <Input name="maps_link" defaultValue={defaults.maps_link} placeholder="https://google.com/maps/..." />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Kawasan (pisahkan koma)</label>
          <Input name="kawasan" defaultValue={defaults.kawasan} required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Unit</label>
          <Input name="unit" defaultValue={defaults.unit} />
        </div>
      </div>

      {errors.ukuran && <p className="text-xs text-[#B33A3A]">{errors.ukuran}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}

