"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { getCsrfToken } from "@/lib/client/csrf";

export function ContactForm() {
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const payload = {
      nama: String(formData.get("nama") ?? ""),
      email: String(formData.get("email") ?? ""),
      nomorHp: String(formData.get("nomorHp") ?? ""),
      pesan: String(formData.get("pesan") ?? ""),
    };

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!response.ok) {
        pushToast(body.error ?? "Gagal mengirim pesan.", "error");
        setLoading(false);
        return;
      }

      pushToast(body.message ?? "Pesan terkirim, tim kami akan menghubungi Anda.");
      (document.getElementById("contact-form") as HTMLFormElement | null)?.reset();
    } catch {
      pushToast("Terjadi kesalahan jaringan.", "error");
    }

    setLoading(false);
  }

  return (
    <form id="contact-form" action={onSubmit} className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nama</label>
        <Input name="nama" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <Input name="email" type="email" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Nomor HP</label>
        <Input name="nomorHp" required minLength={10} pattern="[0-9]{10,}" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Pesan</label>
        <Textarea name="pesan" rows={5} required />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}

