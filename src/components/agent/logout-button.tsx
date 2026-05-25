"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

export function LogoutButton() {
  const router = useRouter();
  const { pushToast } = useToast();

  async function onLogout() {
    const response = await fetch("/api/agent/logout", { method: "POST" });
    if (!response.ok) {
      pushToast("Gagal logout.", "error");
      return;
    }
    router.push("/agent/login");
  }

  return (
    <Button variant="outline" onClick={onLogout}>
      Logout
    </Button>
  );
}

