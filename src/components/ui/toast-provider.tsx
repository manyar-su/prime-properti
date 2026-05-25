"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextType = {
  pushToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider.");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const pushToast = React.useCallback((message: string, variant: ToastVariant = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-lg border px-4 py-3 text-sm font-medium text-white shadow-lg",
              toast.variant === "success" ? "border-emerald-600 bg-emerald-700" : "border-[#B33A3A] bg-[#B33A3A]",
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

