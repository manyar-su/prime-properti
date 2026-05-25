import { ContactForm } from "@/components/public/contact-form";
import { PublicPageFrame } from "@/components/public/page-frame";

export default function ContactPage() {
  return (
    <PublicPageFrame>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Kontak Kami</h1>
        <p className="mt-2 text-sm text-zinc-600">Hubungi tim Prime Property untuk konsultasi dan kebutuhan listing Anda.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
            <div>
              <h2 className="text-lg font-semibold">Informasi Kantor</h2>
              <p className="mt-1 text-sm text-zinc-700">Jl. Contoh Properti No. 88, Medan, Sumatera Utara</p>
            </div>
            <p className="text-sm text-zinc-700">Telepon: +62 61 1234 5678</p>
            <p className="text-sm text-zinc-700">Email: halo@primeproperty.id</p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md border border-[#C9A961] px-4 py-2 text-sm font-semibold text-[#C9A961] hover:bg-[#C9A961] hover:text-[#1A1A1A]"
            >
              Chat WhatsApp
            </a>

            <div className="aspect-video overflow-hidden rounded-lg border border-zinc-200">
              <iframe
                title="Lokasi Prime Property"
                src="https://www.google.com/maps?q=Medan&output=embed"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </PublicPageFrame>
  );
}

