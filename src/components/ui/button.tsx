import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-[#C9A961] text-[#1A1A1A] hover:bg-[#b79955]",
        variant === "outline" && "border border-[#C9A961] text-[#C9A961] hover:bg-[#C9A961] hover:text-[#1A1A1A]",
        variant === "danger" && "bg-[#B33A3A] text-white hover:bg-[#992d2d]",
        variant === "ghost" && "text-[#1A1A1A] hover:bg-[#F5F5F5]",
        className,
      )}
      {...props}
    />
  );
}

