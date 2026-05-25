import { PublicPageFrame } from "@/components/public/page-frame";

export default function AboutPage() {
  return (
    <PublicPageFrame>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Tentang Prime Property</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm leading-7 text-zinc-700">
              Prime Property adalah konsultan properti yang berfokus pada hunian dan investasi premium di kawasan
              strategis Medan. Kami memadukan pemahaman pasar lokal dengan proses kerja berbasis data agar setiap
              keputusan pembelian atau penjualan menjadi lebih presisi.
            </p>
            <div>
              <h2 className="text-lg font-semibold">Visi</h2>
              <p className="text-sm text-zinc-700">
                Menjadi mitra properti paling tepercaya di Sumatera Utara dengan standar layanan modern dan transparan.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Misi</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
                <li>Menyediakan listing berkualitas dengan data lengkap dan akurat.</li>
                <li>Memberikan pendampingan end-to-end untuk pembeli, penjual, dan investor.</li>
                <li>Mengoptimalkan nilai aset klien melalui analisis pasar berkelanjutan.</li>
              </ul>
            </div>
          </div>

          <aside className="rounded-lg border border-[#C9A961]/40 bg-[#1A1A1A] p-6 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-[#C9A961]">Nilai Perusahaan</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-200">
              <li>Integritas dalam setiap rekomendasi.</li>
              <li>Respons cepat dan komunikasi jelas.</li>
              <li>Fokus pada hasil yang terukur untuk klien.</li>
              <li>Kolaborasi jangka panjang, bukan transaksi sesaat.</li>
            </ul>
            <blockquote className="mt-6 border-l-2 border-[#C9A961] pl-3 text-sm italic text-zinc-300">
              &quot;Keputusan properti terbaik dimulai dari data yang jernih dan partner yang tepat.&quot;
            </blockquote>
          </aside>
        </div>
      </section>
    </PublicPageFrame>
  );
}

