import Link from "next/link";
import Image from "next/image";

export function LogoMark() {
  return (
    <div className="flex items-center">
      <Image
        src="/images/brand/prime-property-logo.jpeg"
        alt="Prime Property Logo"
        width={180}
        height={56}
        className="h-11 w-auto object-contain sm:h-12"
        priority
      />
    </div>
  );
}

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/">
            <LogoMark />
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-700 sm:flex">
            <Link href="/" className="hover:text-[#1A1A1A]">Beranda</Link>
            <Link href="/about" className="hover:text-[#1A1A1A]">Tentang Kami</Link>
            <Link href="/contact" className="hover:text-[#1A1A1A]">Kontak</Link>
          </nav>

          <Link
            href="/agent/login"
            className="hidden rounded-md border border-[#C9A961] px-3 py-2 text-sm font-semibold text-[#C9A961] transition hover:bg-[#C9A961] hover:text-[#1A1A1A] sm:inline-flex"
          >
            Login Agent
          </Link>

          <details className="sm:hidden">
            <summary className="list-none rounded-md border border-zinc-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-700">
              Menu
            </summary>
            <nav className="absolute right-4 mt-2 min-w-48 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
              <Link href="/" className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100">Beranda</Link>
              <Link href="/about" className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100">Tentang Kami</Link>
              <Link href="/contact" className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100">Kontak</Link>
              <Link
                href="/agent/login"
                className="mt-1 block rounded-md border border-[#C9A961] px-3 py-2 text-center text-sm font-semibold text-[#C9A961]"
              >
                Login Agent
              </Link>
            </nav>
          </details>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto sm:hidden">
          <Link href="/" className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700">Beranda</Link>
          <Link href="/about" className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700">Tentang Kami</Link>
          <Link href="/contact" className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700">Kontak</Link>
        </div>
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

