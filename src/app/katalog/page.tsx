import { prisma } from "@/lib/prisma";
import KatalogClient from "@/components/katalog/KatalogClient";
import { Metadata } from "next";
import { stripHtml } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Katalog Desa - Potensi UMKM & Wisata",
  description: "Jelajahi potensi lokal, UMKM, kerajinan, dan destinasi wisata di Desa Suka Makmur.",
};

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const page = 1;
  const limit = 12;
  const category = typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;

  const where: any = {};
  
  if (category && category.toLowerCase() !== "semua") {
    where.category = {
      nama: category
    };
  }

  if (search) {
    where.OR = [
      { nama: { contains: search, mode: 'insensitive' } },
      { deskripsi: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Fetch categories from database
  const categories = await prisma.katalogCategory.findMany();

  // Fetch katalog data from database (real data, not mock)
  let katalogData = await prisma.katalog.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  // If no data found, provide empty array (no hardcoded mock data)
  const initialData = katalogData.map(item => ({
    id: item.id,
    nama: item.nama,
    slug: item.slug,
    category: { id: item.category.id, nama: item.category.nama, icon: item.category.icon },
    deskripsi: stripHtml(item.deskripsi),
    dusun: item.dusun,
    fotoUrl: item.fotoUrl,
    latitude: item.latitude,
    longitude: item.longitude,
    kontak: item.kontak,
  }));

  // Count total records matching filter
  const total = await prisma.katalog.count({ where });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Katalog Potensi Desa
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Temukan berbagai produk unggulan UMKM, wisata alam, kuliner, dan kerajinan lokal desa kami.
          </p>
        </div>

        <KatalogClient 
          initialData={initialData} 
          initialTotal={total}
          categories={categories}
          currentCategory={category || "Semua"}
          currentSearch={search || ""}
        />
      </div>
    </div>
  );
}
