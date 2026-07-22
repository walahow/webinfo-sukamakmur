import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import MapWrapper from "@/components/katalog/MapWrapper";
import { prisma } from "@/lib/prisma";

import { ArrowLeft, MapPin, Phone, Calendar, Store, Share2, FileText } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const item = await prisma.katalog.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!item) {
      return { title: "Katalog Tidak Ditemukan - Desa Suka Makmur" };
    }

    return {
      title: `${item.nama} | ${item.category.nama} Desa Suka Makmur`,
      description: item.deskripsi.substring(0, 160),
      openGraph: {
        title: item.nama,
        description: item.deskripsi.substring(0, 160),
        images: item.fotoUrl ? [item.fotoUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for katalog:', error);
    return { title: "Katalog Tidak Ditemukan - Desa Suka Makmur" };
  }
}

export default async function KatalogDetailPage({ params }: Props) {
  const { slug } = await params;
  
  let item;
  try {
    item = await prisma.katalog.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (error) {
    console.error('Error fetching katalog:', error);
  }

  if (!item) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-24">
      {/* Hero Header */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <Link 
            href="/katalog" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                {item.category.nama}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                {item.nama}
              </h1>
              {item.dusun && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                  <MapPin size={18} className="text-primary" />
                  <span>{item.dusun}, Desa Suka Makmur</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 shrink-0">
              {item.kontak && (
                <a 
                  href={`https://wa.me/${item.kontak.replace(/\D/g,'')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors shadow-lg shadow-green-500/20"
                >
                  <Phone size={18} /> Hubungi
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Main Image */}
            <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative shadow-sm">
              {item.fotoUrl ? (
                <Image 
                  src={item.fotoUrl} 
                  alt={item.nama}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <Store size={64} />
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <FileText size={20} className="text-primary" /> Deskripsi
              </h3>
              <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: item.deskripsi }} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">Informasi Tambahan</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Terdaftar Sejak</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>

                {item.kontak && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Kontak</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.kontak}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Mini */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Lokasi</h3>
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-0">
                <MapWrapper items={[item]} />
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
