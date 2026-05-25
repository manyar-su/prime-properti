import { PublicFooter, PublicHeader } from "@/components/public/public-shell";

export function PublicPageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}

