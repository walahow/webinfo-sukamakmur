import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
      className={cn("h-full scroll-smooth", "antialiased", inter.variable)}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
