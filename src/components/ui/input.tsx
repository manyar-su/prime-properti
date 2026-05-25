import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-zinc-300 px-3 text-sm text-[#1A1A1A] placeholder:text-zinc-500 focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/30 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-zinc-500 focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/30 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

