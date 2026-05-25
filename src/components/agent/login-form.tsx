"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";

export function LoginForm() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);

    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const response = await fetch("/api/agent/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      pushToast(body.error ?? "Login gagal.", "error");
      setLoading(false);
      return;
    }

    router.push("/agent/properties");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700">Email</label>
        <Input name="email" type="email" required />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700">Password</label>
        <Input name="password" type="password" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}

