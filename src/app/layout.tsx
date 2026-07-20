import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Desa Suka Makmur - Portal Informasi Resmi",
  description: "Website resmi Desa Suka Makmur, Kecamatan Contoh, Kabupaten Contoh",
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
        <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="relative w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] opacity-[0.15] dark:opacity-[0.1]">
            <Image
              src="/deliSerdang.png"
              alt="Logo Deli Serdang Background"
              fill
              sizes="(max-width: 500px) 100vw, 500px"
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
