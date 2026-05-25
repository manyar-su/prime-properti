"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { getCsrfToken } from "@/lib/client/csrf";

export function DeletePropertyButton({ id, nama }: { id: string; nama: string }) {
  const router = useRouter();
  const { pushToast } = useToast();

  async function onDelete() {
    const ok = window.confirm(`Yakin hapus properti ${nama}? Tindakan ini tidak dapat dibatalkan.`);
    if (!ok) return;

    const csrfToken = await getCsrfToken();
    const response = await fetch(`/api/properties/${id}`, {
      method: "DELETE",
      headers: {
        "x-csrf-token": csrfToken,
      },
    });

    if (!response.ok) {
      pushToast("Gagal menghapus properti.", "error");
      return;
    }

    pushToast("Properti berhasil diarsipkan.");
    router.push("/agent/properties");
    router.refresh();
  }

  return (
    <Button variant="danger" onClick={onDelete}>
      Hapus
    </Button>
  );
}

