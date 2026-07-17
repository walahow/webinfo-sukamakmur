import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Desa Walaho - Portal Informasi Resmi",
  description: "Website resmi Desa Walaho, Kecamatan Contoh, Kabupaten Contoh",
  icons: {
    icon: "/deliSerdang.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full scroll-smooth", "antialiased")}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-primary/20 selection:text-primary relative">
        <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.95] dark:opacity-[0.75] overflow-hidden">
          <div className="relative w-[120vw] h-[120vh] max-w-[800px] max-h-[800px]">
            <Image
              src="/deliSerdang.png"
              alt="Logo Deli Serdang Background"
              fill
              sizes="(max-width: 800px) 100vw, 800px"
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
