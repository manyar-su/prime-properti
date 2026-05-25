import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prime Property",
  description: "Prime Property Web Platform & Internal Agent Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FFFFFF] text-[#1A1A1A]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

