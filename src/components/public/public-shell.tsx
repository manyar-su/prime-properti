import Link from "next/link";

export function LogoMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-sm bg-[#C9A961]" aria-hidden />
      <div>
        <p className="text-sm font-bold tracking-wide text-[#1A1A1A]">PRIME PROPERTY</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">placeholder brand</p>
      </div>
    </div>
  );
}

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="mr-4">
          <LogoMark />
        </Link>
        <nav className="flex flex-1 items-center gap-4 text-sm font-medium text-zinc-700">
          <Link href="/" className="hover:text-[#1A1A1A]">Beranda</Link>
          <Link href="/about" className="hover:text-[#1A1A1A]">Tentang Kami</Link>
          <Link href="/contact" className="hover:text-[#1A1A1A]">Kontak</Link>
        </nav>
        <Link
          href="/agent/login"
          className="rounded-md border border-[#C9A961] px-3 py-2 text-sm font-semibold text-[#C9A961] transition hover:bg-[#C9A961] hover:text-[#1A1A1A]"
        >
          Login Agent
        </Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-[#F5F5F5]">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="space-y-3">
          <LogoMark />
          <p className="text-sm text-zinc-600">Partner properti tepercaya untuk kebutuhan hunian dan investasi Anda.</p>
        </div>
        <div className="space-y-2 text-sm text-zinc-700">
          <p>Telepon/WA: +62 812-3456-7890</p>
          <p>Email: halo@primeproperty.id</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-[#1A1A1A]">Tentang Kami</Link>
            <Link href="/contact" className="hover:text-[#1A1A1A]">Kontak</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

