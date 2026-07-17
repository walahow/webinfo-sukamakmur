import { prisma } from "@/lib/prisma";
import KatalogClient from "@/components/katalog/KatalogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Desa - Potensi UMKM & Wisata",
  description: "Jelajahi potensi lokal, UMKM, kerajinan, dan destinasi wisata di Desa Walaho.",
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
      { nama: { contains: search } },
      { deskripsi: { contains: search } },
    ];
  }

  const total = await prisma.katalog.count({ where });
  
  const katalogItems = await prisma.katalog.findMany({
    where,
    include: {
      category: true,
    },
    skip: 0,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });

  const categories = await prisma.katalogCategory.findMany({
    orderBy: { nama: 'asc' }
  });

  const initialData = katalogItems.map(item => ({
    id: item.id,
    nama: item.nama,
    slug: item.slug,
    category: {
      id: item.category.id,
      nama: item.category.nama
    },
    deskripsi: item.deskripsi,
    dusun: item.dusun,
    fotoUrl: item.fotoUrl,
    latitude: item.latitude,
    longitude: item.longitude,
    kontak: item.kontak,
  }));

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
