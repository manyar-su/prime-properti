import Link from "next/link";

import type { SessionPayload } from "@/types/property";
import { LogoutButton } from "@/components/agent/logout-button";

export function AgentShell({
  session,
  children,
}: {
  session: SessionPayload;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold tracking-wide text-[#1A1A1A]">PRIME PROPERTY</p>
            <p className="text-xs text-zinc-600">Portal Agent Internal</p>
          </div>
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
            <span className="truncate text-xs text-zinc-700 sm:text-sm">
              {session.name} ({session.role})
            </span>
            <LogoutButton />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:hidden">
          <Link href="/agent/properties" className="whitespace-nowrap rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700">
            Listing Properti
          </Link>
          {session.role === "superadmin" && (
            <Link href="/agent/properties/new" className="whitespace-nowrap rounded-full bg-[#1A1A1A] px-3 py-1.5 text-xs font-semibold text-white">
              + Tambah Properti
            </Link>
          )}
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
        <aside className="hidden w-60 shrink-0 md:block">
          <nav className="space-y-2 rounded-lg border border-zinc-200 bg-white p-3">
            <Link href="/agent/properties" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100">
              Listing Properti
            </Link>
            {session.role === "superadmin" && (
              <Link href="/agent/properties/new" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100">
                + Tambah Properti
              </Link>
            )}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

