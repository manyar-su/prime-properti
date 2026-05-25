import Link from "next/link";

import { FeaturedProperties } from "@/components/public/featured-properties";
import { PublicPageFrame } from "@/components/public/page-frame";
import { listFeaturedProperties } from "@/lib/services/property-service";

async function getFeatured() {
  try {
    return await listFeaturedProperties(6);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <PublicPageFrame>
      <section className="bg-[#1A1A1A] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 inline-block rounded-full border border-[#C9A961] px-3 py-1 text-xs tracking-[0.2em] text-[#C9A961] uppercase">
            Prime Property
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Solusi Properti Premium untuk Hunian dan Investasi di Medan
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Temukan listing terkurasi dengan data terstruktur, transparan, dan cepat untuk pengambilan keputusan.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-md bg-[#C9A961] px-5 py-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#b79955]"
            >
              Hubungi Kami
            </Link>
            <Link href="/about" className="rounded-md border border-[#C9A961] px-5 py-3 text-sm font-semibold text-[#C9A961]">
              Pelajari Prime Property
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Properti Unggulan</h2>
          <p className="text-sm text-zinc-600">Maksimal 6 listing terbaru</p>
        </div>
        <p className="mb-4 text-xs text-zinc-500">
          Placeholder aktif: jika data database kosong, sistem menampilkan properti dummy otomatis.
        </p>

        {featured.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
            Belum ada data properti. Jalankan seed data atau tambahkan listing dari dashboard superadmin.
          </div>
        ) : (
          <FeaturedProperties properties={featured} />
        )}
      </section>

      <section className="mx-auto mt-14 w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Mengapa Prime Property</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["Data Ringkas", "Informasi listing tersusun rapi untuk analisis cepat."],
            ["Tim Responsif", "Pendampingan konsultatif dari survey hingga negosiasi."],
            ["Kurasi Lokasi", "Fokus area strategis dengan potensi nilai jangka panjang."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-lg border border-zinc-200 bg-white p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicPageFrame>
  );
}

